"use strict";

// Dependencies
// @AssetRequest@

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
	    let self = this;
	    $.ajax(
	    {
		type: "GET",
		url: "http://sarian.world/materials/" + this.m_URI + ".json",
		async: true,
		beforeSend: (xhr) =>
		{
		    if(xhr && xhr.overrideMimeType)
		    {
			xhr.overrideMimeType("application/json;charset=utf-8");
		    }
		    self.OnDownloading();
		},
		dataType: "json",
		success: (data) => self.OnComplete(data),
		error: (req, status, err) => this.OnError(err)
	    });
	}
	catch(Exception)
	{
	    this.OnError();
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
	let material;
	switch(this.m_Data.type)
	{
	    case "THREE.MeshPhongMaterial":
		material = new THREE.MeshPhongMaterial(
		{
		    color: this.m_Data.type,
		    map: texture(this.m_Data.texture),
		    transparent: true,
		    opacity: 1
		});
		break;
	    default:

		break;
	}

	this.OnFinished(material);
    }
}









