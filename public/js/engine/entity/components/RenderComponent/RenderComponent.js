"use strict";

// Dependencies
// @Component@
// @Entity@

class RenderComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Debuggable = true;

	this.m_Name = "RenderComponent";
	this.m_Parent.m_Renderable = true;
	this.m_Mesh = args.Mesh || null;
    }

    Initialise()
    {
	super.Initialise();
    }

    OnInitialised()
    {
	this.SetPosition(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y,
this.m_Parent.m_Position.z);
	this.m_Mesh.m_ParentEntity = this.m_Parent || null;
	GAME.m_World.m_Scene.add(this.m_Mesh);
	this.m_IsInitialised = true;
    }

    SetTexture(name)
    {
	try
	{
	    this.m_Mesh.material.map = texture(name);
	    this.m_Mesh.material.map.needsUpdate = true;
	    this.m_Mesh.material.needsUpdate = true;
	}
	catch(Exception) { setTimeout(() => this.SetTexture(name), 100); }
    }

    SetPosition(x,y,z)
    {
	this.m_Mesh.position.set(x,y,z);
	if(this.m_Parent.m_Components.DebugComponent)
	{
	    this.m_Parent.m_Components.DebugComponent.SetPosition(x,y,z);
	}
    }

    SetScale(x,y,z)
    {
	this.m_Mesh.scale.set(x,y,z);
    }

    Update()
    {
    }
}
