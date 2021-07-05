"use strict";

import BaseObject from "./entity/entities/BaseObject";
import Entity from "./entity/entities/Entity";
import World from "./entity/World";
import Comms from "./entity/mixins/Comms/Comms";

import AssetCache from "./asset/AssetCache";
import Mouse from "./Mouse";

import {mix} from "mixwith";

require("./util/global/entities");
require("./util/global/json");
require("./util/global/material");
require("./util/global/model");
require("./util/global/texture");
require("./util/global/gmodel");

class Engine extends mix(BaseObject).with()
{
    constructor()
    {
		super();

		this.m_UpdateIntervalID = null;
		this.m_UpdateArray = [];

		this.m_AssetCache = null;
		this.m_World = null;
		this.m_Mouse = null;

		this.m_Initialised = false;

		this.m_LastUpdate = 0;

		this.OnInitialised = () => console.log("ENGINE INITIALISED");
    }

    Initialise()
    {
		this.m_AssetCache = new AssetCache();
		this.m_World = new World();
		this.m_World.Initialise();
		this.m_Mouse = new Mouse();

		this.BeginUpdating(0, () => ENGINE.m_AssetCache.Update());
		this.BeginUpdating(1, (dt) => ENGINE.m_World.Update(dt));

		this.m_UpdateIntervalID = setInterval(this.Update.bind(this), 1000/30);
		this.OnInitialised();
		this.m_Initialised = true;
	}

	BeginUpdating(num, func)
	{
		this.m_UpdateArray.push(
		{
			ref: num,
			x: func
		});
    }

    StopUpdating(obj, func)
    {
		this.m_UpdateArray.splice(
			this.m_UpdateArray.indexOf(
				this.m_UpdateArray.find(f =>
					f.ref === obj
				)
			), 1
		);
    }

    Update()
    {
		this.m_UpdateArray.forEach(
			f => f.x(
				Math.max((performance.now() - this.m_LastUpdate)/1000, 0)
			)
		);
    }
}

export default Engine;
