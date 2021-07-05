"use strict";

import * as THREE from "three";
import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class BasicBoxMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
		super.Initialise();
		var geoBox = new THREE.BoxGeometry(1,1,1);
		geoBox.center();

		var mshBox = new THREE.Mesh(geoBox, material(this.m_Args.material || "default"));
		mshBox.material.needsUpdate = true;
		mshBox.material.map.needsUpdate = true;

		this.m_Mesh = mshBox;
		this.m_Meshes = mshBox;
		this.OnInitialised();
    }

    Update()
    {
    }
}

export default BasicBoxMeshRenderComponent;