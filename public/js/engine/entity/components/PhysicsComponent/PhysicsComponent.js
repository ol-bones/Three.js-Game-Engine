"use strict";

// Dependencies
// @Component@
// @Entity@

class PhysicsComponent extends mix(Component).with()
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
	super.Initialise();


	this.m_PhysicsBody.position.set(
	    this.m_Parent.m_Position.x,
	    this.m_Parent.m_Position.y,
	    this.m_Parent.m_Position.z
	);

	this.m_PhysicsBody.m_ParentEntity = this.m_Parent;
	this.m_PhysicsBody.collisionResponse = true;

	GAME.m_World.m_PhysicsWorld.add(this.m_PhysicsBody);

	this.OnInitialised();
     }

    SetVelocity(x,y,z)
    {
	this.m_PhysicsBody.velocity = new CANNON.Vec3(x,y,z);
    }

    ApplyForce(x,y,z)
    {
	this.m_PhysicsBody.force.x += x;
	this.m_PhysicsBody.force.y += y;
	this.m_PhysicsBody.force.z += z;
    }

    Update()
    {
	let body_pos = new THREE.Vector3(this.m_PhysicsBody.position.x, this.m_PhysicsBody.position.y, this.m_PhysicsBody.position.z);
	this.m_Parent._SetPosition(body_pos.x, body_pos.y, body_pos.z);
	this.m_Parent.m_Components.RenderComponent.m_Mesh.quaternion.copy(this.m_PhysicsBody.quaternion);
    }
}
