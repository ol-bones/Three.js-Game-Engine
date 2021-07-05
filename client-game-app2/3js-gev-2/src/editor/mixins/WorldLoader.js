"use strict";

import Entity from "./../../engine/entity/entities/Entity";
import {mix, Mixin} from "mixwith";

let WorldLoader = Mixin((superclass) => class extends superclass
{
    constructor()
    {
	super();
    }

    LoadWorld()
    {
		try
		{
			let data = json(`/data/world/0.json`);
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
});

export default WorldLoader;
