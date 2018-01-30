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
	this.m_Meshes = _.flattenDeep(this.m_Mesh.children);
	this.m_Meshes.forEach(m => m.material = m.material.clone());
	this.m_Meshes.forEach(m =>
	{
	    m.m_ParentEntity = this.m_Parent
	});

	this.OnInitialised();
    }

    SetColor(c)
    {
	this.m_Meshes.forEach(m =>
	    m.material.color.set(c)
	);
    }

    Update()
    {
    }
}
