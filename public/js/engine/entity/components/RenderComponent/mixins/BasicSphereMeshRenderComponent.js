"use strict";

// Dependencies
// @RenderComponent@

class BasicSphereMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
	super.Initialise();

	var geoBox = new THREE.SphereGeometry(
	    this.m_Args.Radius ? this.m_Args.Radius : 25,
	    this.m_Args.Segments ? this.m_Args.Segments : 25,
	    this.m_Args.Segments ? this.m_Args.Segments : 25
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
