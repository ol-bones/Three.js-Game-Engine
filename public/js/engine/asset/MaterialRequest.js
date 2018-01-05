"use strict";

// Dependencies
// @AssetRequest@

class MaterialRequest extends mix(AssetRequest).with()
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
		success: (data) => self.OnFinished(data),
		error: (req, status, err) => this.OnError(err)
	    });
	}
	catch(Exception)
	{
	    this.OnError();
	}
    }

    OnFinished(json)
    {
	ParseMaterialData(json);
	this.m_Asset = json;
	super.OnFinished();
    }

    ParseMaterialData(json)
    {
	let material;
	switch(json.type)
	{
	    case "THREE.MeshPhongMaterial":
		//material = new THREE.MeshPhongMaterial(
		  //  color: json.color 
		break;
	    default:

		break;
	}
	debugger;
    }
}









