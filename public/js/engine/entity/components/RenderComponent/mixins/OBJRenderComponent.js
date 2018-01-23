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

	this.m_Mesh = model(this.m_Args.model);

	this.OnInitialised();
    }

    Update()
    {
    }
}
