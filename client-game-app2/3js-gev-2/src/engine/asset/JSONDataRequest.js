"use strict";

import AssetRequest from "./AssetRequest";
import LOADSTATE from "./LoadState";
import {mix} from "mixwith";

const axios = require('axios');

class JSONDataRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
	super(uri);
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
			axios.get(`http://${CONFIG.host}${this.m_URI}`)
				.then((data) => this.OnFinished(data.data))
				.catch((error) => this.OnError(error));
		}
		catch(Exception)
		{
			this.OnError(Exception);
		}
    }

    OnFinished(json)
    {
		this.m_Asset = json;
		super.OnFinished();
    }
}

export default JSONDataRequest;