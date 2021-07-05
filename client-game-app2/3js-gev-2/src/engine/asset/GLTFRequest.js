"use strict";

import * as THREE from "three";
import AssetRequest from "./AssetRequest";
import LOADSTATE from "./LoadState";
import {mix} from "mixwith";


class GLTFRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
		super(uri);
    }

    Initialise()
    {
		this.m_LoadState = LOADSTATE.INITIALISING;
		
		this.m_Loader = new THREE.GLTFLoader();

		this.m_Loader.setPath(`http://${CONFIG.host}/models/`);
		//this.m_Loader.setCrossOrigin("");
		//this.m_Loader.crossOrigin = "";

		// TODO: Use .setWithCredentials with a server generated request key/token/idk
		//	    - This should be issued by the web server.js
		//	    - Should expire after 5minutes or something
		//	    - Prevents ddos/spam/chinese theives

		this.OnInitialised();
    }

    Download()
    {
		try
		{
			this.m_Loader.load
			(
				this.m_FileName + "/" + this.m_URI,
				this.OnFinished.bind(this),
				this.OnProgress.bind(this),
				this.OnError.bind(this)
			);
			this.OnDownloading();
		}
		catch(Exception)
		{
			this.OnError();
		}
    }

    OnFinished(gltf)
    {
		this.m_Asset = gltf;
		super.OnFinished();
    }
}

export default GLTFRequest;