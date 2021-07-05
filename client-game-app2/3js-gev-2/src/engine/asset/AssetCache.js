"use strict";

import AssetLoader from "./AssetLoader";
import assetRequest from "./AssetRequest";
import TextureRequest from "./TextureRequest";
import JSONDataRequest from "./JSONDataRequest";
import MaterialRequest from "./MaterialRequest";
import OBJRequest from "./OBJRequest";
import GLTFRequest from "./GLTFRequest";

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
		if(type === "material" && typeof assetURI === "object" && JSON.stringify(assetURI))
		{
			let inlineMaterial = new MaterialRequest("inline");
			inlineMaterial.m_Data = assetURI;
			inlineMaterial.Process();
			return inlineMaterial.m_Asset;
		}
		else if(this.AssetExists(assetURI))
		{
			let asset = this.FindAsset(assetURI).asset;
			switch(type)
			{
				case "json":
				{
					try { return JSON.parse(JSON.stringify(asset)); }
					catch(e) { return asset; }
					break;
				}
				default:
				{
					try { return asset.clone(); asset.needsUpdate = true;}
					catch(e) { try { return asset.copy(); } catch(e) { return asset; }}
					break;
				}
			}
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
			case "material":
				request = new MaterialRequest(assetURI);
				break;
			case "model":
				request = new OBJRequest(assetURI);
				break;
			case "gmodel":
				request = new GLTFRequest(assetURI);
				break;
			default:
				return false;
			}

			this._AssetLoader.Enqueue(request);
		}
		return null;
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
		this._AssetLoader.Update();
		this.m_AddQueue.forEach(x => this.Cache(x));
		this.m_AddQueue = [];
    }
}

AssetCache.TextureList = [];
AssetCache.ModelList = [];

export default AssetCache;