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
	ENGINE.m_World.m_Scene.add(this.m_Mesh);
	this.m_IsInitialised = true;
    }

    GetSize3()
    {
	let box = new THREE.Box3().setFromObject(
	    this.m_Mesh
	);
	return new THREE.Vector3(
	    Math.abs(box.max.x - box.min.x),
	    Math.abs(box.max.y - box.min.y),
	    Math.abs(box.max.z - box.min.z)
	);
    }

    GetSizeRadius()
    {
	let box = new THREE.Box3().setFromObject(
	    this.m_Mesh
	);
	return box.min.distanceTo(box.max);
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

    SetColor(c)
    {
	this.m_Mesh.material.color.set(c);
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

    Remove()
    {
	ENGINE.m_World.m_Scene.remove(this.m_Mesh);
	try
	{
	    this.m_Mesh.material.dispose();
	    delete this.m_Mesh.material;
	} catch(e) {}
	delete this.m_Mesh;
    }

    Update()
    {
    }
}
