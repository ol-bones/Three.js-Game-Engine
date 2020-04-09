"use strict";

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

        var groundMaterial = new CANNON.Material("groundMaterial");

		let materialOptions = {
            friction: 400,
            restitution: 3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
        };
        // Adjust constraint equation parameters for ground/ground contact

        // Add contact material to the world

		let scale = this.m_Parent.m_Scale;
		let angularDamping = 0.1;
		let mass = 0;
		if(this.m_BodySettings.type === "box")
		{
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
			mass = 2;
			angularDamping = 1;
			this.m_PhysicsShape = new CANNON.Sphere(this.m_BodySettings.radius);
		}
        var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, materialOptions);
        ENGINE.m_World.m_PhysicsWorld.addContactMaterial(ground_ground_cm);
		this.m_PhysicsBody = new CANNON.Body({
			mass: mass,
			type: this.m_Args.Type,
			material: ground_ground_cm,
			angularDamping: angularDamping,
			linearDamping: 0.9
		});
		this.m_PhysicsBody.addShape(this.m_PhysicsShape);
		super.Initialise();
    }

    Remove()
    {
		ENGINE.m_World.m_PhysicsWorld.remove(this.m_PhysicsBody);
    }
}

export default BasicPhysicsComponent;