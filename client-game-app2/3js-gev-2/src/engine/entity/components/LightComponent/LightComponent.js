"use strict";

import * as THREE from "three";
import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class LightComponent extends mix(Component).with()
{
    constructor(args)
    {
        super(args);

        this.m_Debuggable = false;

        this.m_Name = "LightComponent";

        this.m_Colour = new THREE.Color(1,1,1);

        this.m_Light = null;
    }

    Initialise()
    {
        super.Initialise();
    }

    OnInitialised()
    {
		this.SetPosition(
			this.m_Parent.m_Position.x,
			this.m_Parent.m_Position.y,
			this.m_Parent.m_Position.z
		);

//		this.m_Light.m_ParentEntity = this.m_Parent || null;

		this.m_Light.castShadow = this.m_Args.castShadow == void(0) ? true : this.m_Args.castShadow;

        this.m_Light.shadow.mapSize.width = 1024;
        this.m_Light.shadow.mapSize.height = 1024;
        this.m_Light.shadow.camera.near = 0.05;
        this.m_Light.shadow.camera.far = 750;
        this.m_Light.shadow.bias = -0.005;

		ENGINE.m_World.m_Scene.add(this.m_Light);
		this.m_IsInitialised = true;
    }

    SetColor(c)
    {
        this.m_Colour = c;
        this.m_Light.color.set(c);
	}
	
    SetPosition(x,y,z)
    {
        this.m_Light.position.set(x,y,z);
    }

    Remove()
    {
        ENGINE.m_World.m_Scene.remove(this.m_Light);
        delete this.m_Light;
    }

    Update()
    {
	}
}

export default LightComponent;