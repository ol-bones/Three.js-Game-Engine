"use strict";

// Dependencies
// @AssetRequest@

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
	    let self = this;
	    $.ajax(
	    {
		type: "GET",
		url: this.m_URI,
		async: true,
		beforeSend: (xhr) =>
		{
		    if (xhr && xhr.overrideMimeType)
		    {
			xhr.overrideMimeType("application/json;charset=utf-8");
		    }
		    self.OnDownloading();
		},
		dataType: "json",
		success: (data) => self.OnFinished(data)
	    });

	}
	catch(Exception)
	{
	    this.OnError();
	}
    }

    OnFinished(json)
    {
	this.m_Asset = json;
	super.OnFinished();
    }
}
