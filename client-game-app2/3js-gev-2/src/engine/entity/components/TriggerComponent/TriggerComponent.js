"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class TriggerComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Name = "TriggerComponent";

		this.m_TriggerFunctions = [];

		this.m_TriggerByPlayerOnly = false;
    }

    Initialise()
    {
		super.Initialise();

		this.m_TriggerByPlayerOnly = this.m_Args.playeronly || false;

		this.m_Parent.m_Components.PhysicsComponent.AddEventListener("collide", evt =>
		{
			if(evt.body.m_ParentEntity.m_ID === this.m_Parent.m_ID) return;
			if(this.m_TriggerByPlayerOnly && evt.body.m_ParentEntity.m_Components.FPSPlayerControl)
			{
				this.OnTrigger(evt);
			}
			else if(!this.m_TriggerByPlayerOnly)
			{
				this.OnTrigger(evt);
			}
		});

		this.OnInitialised();
    }

    OnTrigger(evt)
    {
		if(this.m_TriggerFunctions !== null && Array.isArray(this.m_TriggerFunctions))
		{
			this.m_TriggerFunctions.forEach(f => f(evt));
		}
    }

    Update()
    {
    }
}

export default TriggerComponent;