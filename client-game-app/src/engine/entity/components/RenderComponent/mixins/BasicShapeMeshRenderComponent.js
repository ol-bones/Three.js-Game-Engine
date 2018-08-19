"use strict";

import RenderComponent from "./../RenderComponent";
import {mix} from "mixwith";

class BasicShapeMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	this.m_Debuggable = false;

	var points = [];

	points[0] = new THREE.Vector2(0, 0);
	points[1] = new THREE.Vector2(100, 0);
	points[2] = new THREE.Vector2(100, 300);
	points[3] = new THREE.Vector2(300, 300);
	points[4] = new THREE.Vector2(300, 400);
	points[5] = new THREE.Vector2(100, 400);
	points[6] = new THREE.Vector2(100, 800);
	points[7] = new THREE.Vector2(0, 800);
	points[8] = new THREE.Vector2(0, 500);
	points[9] = new THREE.Vector2(-400, 500);
	points[10] = new THREE.Vector2(-400, 400);
	points[11] = new THREE.Vector2(0, 400);
	points[12] = new THREE.Vector2(0, 0);


	this.m_Points = args.Points || points;
    }

    Initialise()
    {
	super.Initialise();

	let shape = new THREE.Shape(this.m_Points);
	let geometry = new THREE.ShapeBufferGeometry(shape);
	geometry.center();
	let mesh = new THREE.Mesh(geometry, material("check"));
	mesh.material.needsUpdate = true;
	mesh.material.map.needsUpdate = true;

	mesh.rotateX(-Math.PI/2);

	this.m_Mesh = mesh;
	this.m_Meshes = mesh;
	this.OnInitialised();
    }

    Update()
    {
    }
}

export default BasicShapeMeshRenderComponent;