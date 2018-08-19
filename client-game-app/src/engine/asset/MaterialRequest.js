"use strict";

import AssetRequest from "./AssetRequest";
import LOADSTATE from "./LoadState";
import {mix} from "mixwith";

const axios = require('axios');

class MaterialRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
	super(uri);

	this.m_Data = null;
    }

    Initialise()
    {
	this.m_LoadState = LOADSTATE.INITIALISING;

	this.OnInitialised();
    }

    Download()
    {
		try
		{
			this.OnDownloading();
			axios.get(`http://${CONFIG.host}/materials/` + this.m_URI + ".json")
				.then((data) => this.OnComplete(data.data))
				.catch((error) => this.OnError(error));
		}
		catch(Exception)
		{
			this.OnError(Exception);
		}
    }

    OnComplete(data)
    {
	super.OnComplete();
	this.m_Data = data;
	this.m_LoadState = LOADSTATE.PROCESS;
    }

    OnFinished(material)
    {
	this.m_Asset = material;
	super.OnFinished();
    }

    Process()
    {
	try
	{
	    let material;
	    switch(this.m_Data.type)
	    {
		case "THREE.MeshPhongMaterial":
		    material = new THREE.MeshPhongMaterial(
		    {
			color: new THREE.Color(1,1,1),
			map: texture(this.m_Data.texture),
			transparent: true,
			opacity: 1
		    });

		    material.map.needsUpdate = true;
		    material.needsUpdate = true;
		    break;
		default:

		    break;
	    }

	    this.OnFinished(material);
	}
	catch(Exception)
	{
	}
    }
}

export default MaterialRequest;

