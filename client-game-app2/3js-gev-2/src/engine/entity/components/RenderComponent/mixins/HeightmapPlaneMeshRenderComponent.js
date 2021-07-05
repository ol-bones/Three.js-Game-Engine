"use strict";

import * as THREE from "three";
import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class HeightmapPlaneMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
		super(args);
		console.log(args)
    }

    Initialise()
    {
		super.Initialise();
		var geometry = new THREE.PlaneGeometry(
			this.m_Args.Size,
			this.m_Args.Size,
			this.m_Args.Divisions,
			this.m_Args.Divisions
		);

		console.log(geometry)
		geometry.center();

		console.log(this.m_Args.material);
		const material = window.material(this.m_Args.material || "default");
		if(material == void(0)) throw "Not loaded";
		var mshBox = new THREE.Mesh(geometry, material);
		//mshBox.material.needsUpdate = true;
		//mshBox.material.map.needsUpdate = true;
console.log(mshBox)
		this.m_Mesh = mshBox;
		this.m_Meshes = mshBox;
		this.OnInitialised();
    }

    Update()
    {
    }
}

export default HeightmapPlaneMeshRenderComponent;