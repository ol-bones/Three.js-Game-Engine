"use strict";

let WorldLoader = (Main) => class extends Main
{
    constructor()
    {
	super();
    }

    LoadWorld()
    {
	try
	{
	let data = json(`http://${CONFIG.host}/data/world/0.json`);
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
}
