"use strict";

// Dependencies
// @Component@
// @Entity@
// @RenderComponent@
class DebugComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "DebugComponent";

	this.m_Axis = {};
	this.m_Mesh = {};
	this.m_MeshBoundingBox = {};
    }

    Initialise()
    {
	super.Initialise();

	if(this.m_Parent.m_Components.PhysicsComponent)
	{
	    let phys_geom = {};
	    switch(this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.type)
	    {
		case "cylinder": phys_geom = new THREE.CylinderGeometry(
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[0],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[1],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[2], 10, 10
		);
		break;

		case "box": phys_geom = new THREE.BoxGeometry(
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[0],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[1],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[2]
		);
	    }

	    let material = new THREE.LineBasicMaterial({
		color: 0xff0000
	    });

	    this.m_Mesh = new THREE.LineSegments(phys_geom, material);
	    this.m_Mesh.renderOrder = 999;
	    this.m_Mesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };

	    this.m_MeshBoundingBox = new THREE.BoxHelper(
		this.m_Parent.m_Components.RenderComponent.m_Mesh,
		0x0000ff
	    );

	    GAME.m_World.m_Scene.add(this.m_Mesh);
	    GAME.m_World.m_Scene.add(this.m_MeshBoundingBox);

	}

	this.m_Axis = new THREE.AxisHelper(50);
	GAME.m_World.m_Scene.add(this.m_Axis);

	this.m_IsInitialised = true;
    }

    // Called by RenderComponent
    SetPosition(x,y,z)
    {
	if (this.m_Axis.position)
	{
	    this.m_Axis.position.set(x,y,z);
	}
	if(this.m_Mesh.position)
	{
	    this.m_Mesh.position.set
	    (
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.x,
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.y,
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.z
	    );
	    this.m_MeshBoundingBox.position.set
	    (
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.x,
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.y,
		this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.z
	    );

	    this.m_MeshBoundingBox.update();
	}
    }

    Update()
    {
	this.m_Parent.m_Components.RenderComponent.m_Mesh.material.opacity = 0.5;
    }

    Remove()
    {
	super.Remove();

	this.m_Parent.m_Components.RenderComponent.m_Mesh.material.opacity = 1;

	GAME.m_World.m_Scene.remove(this.m_Axis);
	this.m_Axis.material.dispose();
	this.m_Axis.geometry.dispose();
	delete this.m_Axis.material;
	delete this.m_Axis.geometry;
	delete this.m_Axis;

	if(this.m_Mesh)
	{
	    GAME.m_World.m_Scene.remove(this.m_Mesh);
	    this.m_Mesh.material.dispose();
	    this.m_Mesh.geometry.dispose();
	    delete this.m_Mesh.material;
	    delete this.m_Mesh.geometry;
	    delete this.m_Mesh;

	    GAME.m_World.m_Scene.remove(this.m_MeshBoundingBox);
	    this.m_MeshBoundingBox.material.dispose();
	    this.m_MeshBoundingBox.geometry.dispose();
	    delete this.m_MeshBoundingBox.material;
	    delete this.m_MeshBoundingBox.geoemtry;
	    delete this.m_MeshBoundingBox;
	}
    }
}
