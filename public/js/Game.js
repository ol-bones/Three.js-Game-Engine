"use strict";

class Game
{
    constructor()
    {
	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	this.LoadWorld();
    }

    LoadWorld()
    {
	try
	{
	    let data = json(`http://${CONFIG.host}/data/world/0.json`)
	    Entity.FromFile(
		data,
		null,
		new THREE.Vector3(0,0,0)
	    );
	}
	catch(Exception)
	{
	    setTimeout(this.LoadWorld.bind(this), 50);
	}
    }

    Update()
    {
    }
}
