"use strict";

// Dependencies
// @RenderComponent@

class OBJRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
	super.Initialise();

	this.m_Mesh = model("Directors Chair.obj");

	this.OnInitialised();
    }

    Update()
    {
    }
}
