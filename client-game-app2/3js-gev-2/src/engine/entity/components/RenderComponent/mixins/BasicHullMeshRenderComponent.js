"use strict";

import * as THREE from "three";
import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class BasicHullMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	this.m_Debuggable = true;

	var points = [];

	this.m_Points = args.Points;
	this.m_Points = this.m_Points.map(p => {return p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z);});
    }

    Initialise()
    {
	super.Initialise();
//	var geometry = new THREE.ConvexBufferGeometry(this.m_Points);
//	geometry.center();

//	var mesh = new THREE.Mesh(geometry, material("check"));/
//	mesh.material.needsUpdate = true;
//	mesh.material.map.needsUpdate = true;

//	this.m_Mesh = mesh;
//	this.m_Meshes = mesh;
	this.OnInitialised();
    }

    Update()
    {
    }
}

export default BasicHullMeshRenderComponent;