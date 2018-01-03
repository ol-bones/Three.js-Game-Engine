"use strict";

// Dependencies

class AssetLoader
{
    constructor()
    {
	this.m_DequeuedRequests = [];
	this.m_AssetRequestQueue = [];
	this.m_AssetDisposalQueue = [];
    }

    Queued(assetRequest)
    {
	if(this.m_DequeuedRequests.find(r => r.m_URI === assetRequest.m_URI)) return true;
	if(this.m_AssetRequestQueue.find(r => r.m_URI === assetRequest.m_URI)) return true;
	if(this.m_AssetDisposalQueue.find(r => r.m_URI === assetRequest.m_URI)) return true;

	return false;
    }

    Enqueue(assetRequest)
    {
	if(this.Queued(assetRequest)) return;
	this.m_DequeuedRequests.push(assetRequest);
	assetRequest.OnQueued();
    }

    ProcessRequest(assetRequest)
    {
	switch(assetRequest.m_LoadState)
	{
	    case LOADSTATE.QUEUED:
		assetRequest.Initialise();
	    break;
	    case LOADSTATE.INITIALISED:
		assetRequest.Download();
	    break;
	    case LOADSTATE.FINISHED:
		GAME.m_AssetCache.RequestCache(assetRequest);
	    break;
	}
    }

    Update()
    {
	// Queue newly added requests in process queue
	this.m_AssetRequestQueue = this.m_AssetRequestQueue.concat(this.m_DequeuedRequests);
	this.m_DequeuedRequests = [];

	// Begin request download
	this.m_AssetRequestQueue.forEach(x => this.ProcessRequest(x));

	// Get rid of errored or completed requests
	this.m_AssetDisposalQueue = this.m_AssetRequestQueue.filter(x => x.ShouldDispose());
	this.m_AssetDisposalQueue.forEach(x => this.m_AssetRequestQueue.splice(this.m_AssetRequestQueue.indexOf(x), 1));
	this.m_AssetDisposalQueue.forEach(x => { x.Dispose(); });
	this.m_AssetDisposalQueue = [];
    }
}
