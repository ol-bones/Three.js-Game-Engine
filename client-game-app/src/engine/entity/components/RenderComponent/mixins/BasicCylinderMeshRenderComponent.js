"use strict";

import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class BasicCylinderMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
	super.Initialise();

	var geoBox = new THREE.CylinderGeometry(
	    this.m_Args.Scale ? this.m_Args.Scale.rt : 25,
	    this.m_Args.Scale ? this.m_Args.Scale.rb : 25,
	    this.m_Args.Scale ? this.m_Args.Scale.h : 25,
	    this.m_Args.Scale ? this.m_Args.Scale.s : 8
	);
	geoBox.center();

	var mshBox = new THREE.Mesh(geoBox, material("default"));
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

export default BasicCylinderMeshRenderComponent;