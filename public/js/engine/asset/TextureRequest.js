"use strict";

// Dependencies
// @AssetRequest@

class TextureRequest extends mix(AssetRequest).with()
{
    constructor(uri)
    {
	super(uri);
    }

    Initialise()
    {
	this.m_LoadState = LOADSTATE.INITIALISING;

	THREE.ImageUtils.crossOrigin = "";
	THREE.TextureLoader.prototype.crossOrigin = "";
	this.m_Loader = new THREE.TextureLoader();

	this.m_Loader.setPath("http://sarian.world/textures/");
	this.m_Loader.setCrossOrigin("");
	this.m_Loader.crossOrigin = "";

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
		this.m_URI,
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

    OnFinished(texture)
    {
	this.m_Asset = texture;
	super.OnFinished();
    }
}
