"use strict";

import * as CANNON from 'cannon-es';
import Entity from "./../../../entities/Entity";
import Component from "./../../Component";
import PhysicsComponent from "./../PhysicsComponent";
import {mix} from "mixwith";

class BasicPhysicsComponent extends mix(PhysicsComponent).with()
{
    constructor(args)
    {
		super(args);

		this.m_Name = "PhysicsComponent";

		this.m_Force = new CANNON.Vec3(0,0,0);

		this.m_PhysicsBody = {};
		this.m_BodySettings = args.BodySettings || {};

		this.m_GeometryBounds = {
			min: new THREE.Vector3(),
			max: new THREE.Vector3()
		};
    }

    Initialise()
    {
		const scale = this.m_Parent.m_Scale;

		if(this.m_Parent.m_Components.RenderComponent)
		{
			this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.computeBoundingBox();
			this.m_GeometryBounds = this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox;
		}
		else
		{
			this.m_GeometryBounds = {
				min: new THREE.Vector3(-scale.x/2, -scale.y/2, -scale.z/2),
				max: new THREE.Vector3(scale.x/2, scale.y/2, scale.z/2)
			};
		}

		// Default box if no body settings
		this.m_BodySettings = this.m_BodySettings.type ? this.m_BodySettings :
		{
			type: "box",
			size:
			[
				Math.abs(this.m_GeometryBounds.min.x - this.m_GeometryBounds.max.x),
				Math.abs(this.m_GeometryBounds.min.y - this.m_GeometryBounds.max.y),
				Math.abs(this.m_GeometryBounds.min.z - this.m_GeometryBounds.max.z)
			],
			pos:
			[
				this.m_Parent.m_Position.x,
				this.m_Parent.m_Position.y,
				this.m_Parent.m_Position.z
			],
			move: true
		};


		if(this.m_BodySettings.type === "box")
		{
			if(this.m_BodySettings.size == void(0)) this.m_BodySettings.size =
			[
				Math.abs(this.m_GeometryBounds.min.x - this.m_GeometryBounds.max.x),
				Math.abs(this.m_GeometryBounds.min.y - this.m_GeometryBounds.max.y),
				Math.abs(this.m_GeometryBounds.min.z - this.m_GeometryBounds.max.z)
			];

			this.m_PhysicsShape = new CANNON.Box(
				new CANNON.Vec3(
					(this.m_BodySettings.size[0]/2)*scale.x,
					(this.m_BodySettings.size[1]/2)*scale.y,
					(this.m_BodySettings.size[2]/2)*scale.z
				)
			);
		}
		if(this.m_BodySettings.type === "sphere")
		{
			this.m_PhysicsShape = new CANNON.Sphere(this.m_BodySettings.radius);
		}

		//const contactMaterial = this.createContactMaterial();
		//ENGINE.m_World.m_PhysicsWorld.addContactMaterial(contactMaterial);
		
		this.m_PhysicsBody = new CANNON.Body({
			mass: this.m_BodySettings.mass || 0,
			type: this.m_Args.Type, // STATIC = 2, DYNAMIC = 1
			//material: contactMaterial,
			angularDamping: this.m_BodySettings.angularDamping || 0.1,
			linearDamping: this.m_BodySettings.linearDamping || 0.9,
			fixedRotation: this.m_BodySettings.fixedRotation || false
		});

		this.m_PhysicsBody.addShape(this.m_PhysicsShape);
		super.Initialise();
	}
	
	createContactMaterial()
	{
		try
		{
			return new CANNON.ContactMaterial(new CANNON.Material("groundMaterial"),
			{
				friction: this.m_BodySettings.material.friction || 400,
				restitution: this.m_BodySettings.material.restitution || 3,
				contactEquationStiffness: this.m_BodySettings.material.stiffness || 1e8,
				contactEquationRelaxation: this.m_BodySettings.material.relaxation || 3,
				frictionEquationStiffness: this.m_BodySettings.material.frictionstiffness || 1e8,
				frictionEquationRegularizationTime: 3
			});
		}
		catch(e)
		{
			return new CANNON.ContactMaterial(new CANNON.Material("groundMaterial"),
			{
				friction: 400,
				restitution: 3,
				contactEquationStiffness: 1e8,
				contactEquationRelaxation: 3,
				frictionEquationStiffness: 1e8,
				frictionEquationRegularizationTime: 3
			});
		}
	}

    Remove()
    {
		ENGINE.m_World.m_PhysicsWorld.removeBody(this.m_PhysicsBody);
    }
}

export default BasicPhysicsComponent;