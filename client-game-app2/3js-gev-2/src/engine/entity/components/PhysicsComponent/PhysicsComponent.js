"use strict";

import * as THREE from "three";
import * as CANNON from 'cannon-es';
import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class PhysicsComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Name = "PhysicsComponent";

		this.m_Force = new CANNON.Vec3(0,0,0);

		this.m_PhysicsBody = {};
		this.m_BodySettings = args.BodySettings || {};

		this.m_CollisionEventListeners = [];
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
		if(this.m_Args.holographic)
		{
			this.m_PhysicsBody.collisionResponse = false;
		}
		else
		{
			this.m_PhysicsBody.collisionResponse = true;
		}

		this.m_PhysicsBody.sleep();
		ENGINE.m_World.m_PhysicsWorld.addBody(this.m_PhysicsBody);

		if(this.m_PhysicsBody._listeners === undefined)
		{
			this.m_CollisionEventListeners.forEach(listener =>
				this.m_PhysicsBody.addEventListener(listener.type, listener.callback)
			);
		}

		this.OnInitialised();
     }

    SetVelocity(x,y,z)
    {
		this.m_PhysicsBody.velocity = new CANNON.Vec3(x,y,z);
    }

	SetRotation(x, y, z)
	{
		this.m_PhysicsBody.quaternion = new CANNON.Quaternion();
		this.m_PhysicsBody.quaternion.setFromEuler(x, y, z);
	}

	SetRotationQ(x, y, z, w)
	{
		this.m_PhysicsBody.quaternion = new CANNON.Quaternion(x, y, z, w);
	}

    ApplyForce(x,y,z)
    {
			this.m_PhysicsBody.force.x += x;
			this.m_PhysicsBody.force.y += y;
			this.m_PhysicsBody.force.z += z;
    }

	AddEventListener(eventType, callback)
	{
		this.m_CollisionEventListeners.push({type: eventType, callback: callback});

		this.m_PhysicsBody.addEventListener(eventType, callback);
	}

    Update()
    {
			let body_pos = new THREE.Vector3(this.m_PhysicsBody.position.x, this.m_PhysicsBody.position.y, this.m_PhysicsBody.position.z);
			this.m_Parent._SetPosition(body_pos.x, body_pos.y, body_pos.z);
			
			if(!this.m_Parent.m_Components.RenderComponent || !this.m_Parent.m_Components.RenderComponent.m_Mesh) return;
			this.m_Parent.m_Components.RenderComponent.m_Mesh.quaternion.copy(this.m_PhysicsBody.quaternion);
    }
}

export default PhysicsComponent;