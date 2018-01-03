"use strict";

class AssetCache
{
    constructor()
    {
	this.m_Assets = [];

	this.m_AddQueue = [];
	this.m_RemoveQueue = [];

	this._AssetLoader = new AssetLoader();
    }

    GetAsset(assetURI, type)
    {
	if(this.AssetExists(assetURI))
	{
	    return this.FindAsset(assetURI).asset;
	}
	else
	{
	    let request = null;
	    switch(type)
	    {
		case "texture":
		    request = new TextureRequest(assetURI);
		    break;
		case "json":
		    request = new JSONDataRequest(assetURI);
		    break;
		default:
		    return false;
	    }

	    this._AssetLoader.Enqueue(request);
	    return request;
	}
	return false;
    }

    FindAsset(assetURI)
    {
	return this.m_Assets.find(x => x.uri === assetURI);
    }

    AssetExists(assetURI)
    {
	return !!this.FindAsset(assetURI);
    }

    RequestCache(assetRequest)
    {
	this.m_AddQueue.push(assetRequest);
    }

    Cache(assetRequest)
    {
	if(this.m_Assets.find(x => x.name === assetRequest.name))
	{
	    assetRequest.OnError();
	}
	else
	{
	    this.m_Assets.push(
	    {
	        type: assetRequest.m_FileType,
		name: assetRequest.m_FileName,
		uri: assetRequest.m_URI,
		asset: assetRequest.m_Asset
	    });

	    assetRequest.OnCached();
	}
    }

    Update()
    {
	this.m_AddQueue.forEach(x => this.Cache(x));
	this.m_AddQueue = [];
    }
}
