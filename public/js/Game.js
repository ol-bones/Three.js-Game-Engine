"use strict";

class Game
{
    constructor()
    {
	this.m_Debug = true;
	this.m_UpdateIntervalID = null;
    }

    initialise()
    {
	console.log("Debugging: " + (this.m_Debug ? "enabled" : "disabled" ));

	this.m_AssetCache = new AssetCache();

	this.m_World = new World();
	this.m_World.initialise();
	this.m_Mouse = new Mouse();

	this.BeginUpdateLoop();
    }

    BeginUpdateLoop()
    {
	this.m_UpdateIntervalID = setInterval(this.Update.bind(this), 1000/30);
    }

    Update()
    {
	this.m_AssetCache.Update();
	this.m_World.Update();
    }

    log(str)
    {
	if (this.m_Debug)
	{
	    console.log(str);
	}
    }
}
