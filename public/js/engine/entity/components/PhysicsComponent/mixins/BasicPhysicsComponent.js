"use strict";

// Dependencies
// @Component@
// @PhysicsComponent@
// @Entity@


class BasicPhysicsComponent extends mix(PhysicsComponent).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "PhysicsComponent";

	this.m_Force = new CANNON.Vec3(0,0,0);

	this.m_PhysicsBody = {};
	this.m_BodySettings = args.BodySettings || {};
    }

    Initialise()
    {
	this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.computeBoundingBox();
	this.m_BodySettings = this.m_BodySettings.type ? this.m_BodySettings :
	{
	    type:'box',
	    size:
	    [
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.x -
		this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.x),
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.y -
		this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.y),
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.z -
		this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.z)
	    ],
	    pos:[this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z],
	    move:true
	};

	let scale = this.m_Parent.m_Scale;
	this.m_PhysicsShape = new CANNON.Box(
	    new CANNON.Vec3(
		(this.m_BodySettings.size[0]/2)*scale.x,
		(this.m_BodySettings.size[1]/2)*scale.y,
		(this.m_BodySettings.size[2]/2)*scale.z
	    )
	);

	this.m_PhysicsBody = new CANNON.Body({ mass: 10, type: this.m_Args.Type });
	this.m_PhysicsBody.addShape(this.m_PhysicsShape);
 	super.Initialise();
    }

    Remove()
    {
	ENGINE.m_World.m_PhysicsWorld.remove(this.m_PhysicsBody);
    }
}
