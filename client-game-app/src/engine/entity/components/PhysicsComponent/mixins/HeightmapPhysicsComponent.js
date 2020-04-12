"use strict";

import Entity from "./../../../entities/Entity";
import Component from "./../../Component";
import PhysicsComponent from "./../PhysicsComponent";
import {mix} from "mixwith";

class HeightmapPhysicsComponent extends mix(PhysicsComponent).with()
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
		const geometry = this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry;
		geometry.computeBoundingBox();

		try
		{
			let index = 0;
			for(let y = this.m_BodySettings.Divisions; y >= 0; y--)
			{
				for(let x = 0; x <= this.m_BodySettings.Divisions; x++)
				{
					geometry.vertices[index].setZ(this.m_BodySettings.HeightMap[x][y]);
					index++;
				}
			}
		} catch(e) { return false; }

		let scale = this.m_Parent.m_Scale;
		
		this.m_PhysicsShape = new CANNON.Heightfield(this.m_BodySettings.HeightMap, {
			elementSize: this.m_BodySettings.Size / this.m_BodySettings.Divisions
		});

		let mass =  0;
        var groundMaterial = new CANNON.Material("groundMaterial");

		let materialOptions = {
            friction: 40,
            restitution: 3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
		};
        var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, materialOptions);
        ENGINE.m_World.m_PhysicsWorld.addContactMaterial(ground_ground_cm);

		this.m_PhysicsBody = new CANNON.Body({
			mass: mass,
			type: 1,
			material: ground_ground_cm
		});

		this.m_PhysicsBody.addShape(this.m_PhysicsShape);
		if(geometry.vertices[0].x === -(this.m_BodySettings.Size/2))
		{
			const offset = this.m_BodySettings.Size/2;
			geometry.translate(offset, offset, 0);
		}

		geometry.verticesNeedUpdate = true;
		super.Initialise();
    }

	regeneratePhys()
	{
		this.m_PhysicsBody.shapes = [];

		this.m_PhysicsShape = new CANNON.Heightfield(this.m_BodySettings.HeightMap, {
			elementSize: this.m_BodySettings.Size / this.m_BodySettings.Divisions
		});

		let mass =  0;
        var groundMaterial = new CANNON.Material("groundMaterial");

		let materialOptions = {
            friction: 40,
            restitution: 3,
            contactEquationStiffness: 1e8,
            contactEquationRelaxation: 3,
            frictionEquationStiffness: 1e8,
            frictionEquationRegularizationTime: 3,
		};
        var ground_ground_cm = new CANNON.ContactMaterial(groundMaterial, materialOptions);
		ENGINE.m_World.m_PhysicsWorld.addContactMaterial(ground_ground_cm);
		
		this.m_PhysicsBody.addShape(this.m_PhysicsShape);
	}

    Remove()
    {
		ENGINE.m_World.m_PhysicsWorld.remove(this.m_PhysicsBody);
    }
}

export default HeightmapPhysicsComponent;