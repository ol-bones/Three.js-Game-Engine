"use strict";

import * as CANNON from 'cannon-es';
import Entity from "./../../../entities/Entity";
import Component from "./../../Component";
import PhysicsComponent from "./../PhysicsComponent";
import {mix} from "mixwith";

class OBJPhysicsComponent extends mix(PhysicsComponent).with()
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
		let name = this.m_Args.model;
		let phys_model = null;
		if(name.includes(".obj"))
		{
			phys_model = json(name.replace(".obj", ".phys"));
		}
		else
		{
			phys_model = json(name);
		}
		console.log(phys_model);

		let kvp = Object.keys(phys_model)
			.map(key => [key, phys_model[key]]);

		this.m_PhysicsBody = new CANNON.Body({
			mass: this.m_Args.mass || 0,
			type: this.m_Args.Type || 2
		});

		kvp.forEach(physics_submodel =>
		{
			let phys_name = physics_submodel[0];
			let phys_data = physics_submodel[1];
			if(phys_data.type === 1)
			{
			this.m_PhysicsBody.addShape(
				new CANNON.Box(new CANNON.Vec3(
				...Object.keys(phys_data.scale).map(
					dir => phys_data.scale[dir]
					* (this.m_Parent.m_Scale[dir]/2)
				)
				)),
				new CANNON.Vec3(
				...Object.keys(phys_data.pos).map(
					dir => phys_data.pos[dir]
					* this.m_Parent.m_Scale[dir]
				)
				)
			);
			if(phys_data.rot)
			{
				this.m_PhysicsBody.shapeOrientations[
				this.m_PhysicsBody.shapeOrientations.length-1
				].setFromAxisAngle(
				new CANNON.Vec3(
					...Object.keys(phys_data.rot.axis).map(
					axis => phys_data.rot.axis[axis]
					)
				),
				phys_data.rot.r
				);
			}
			}
			if(phys_data.type === 2)
			{
			this.m_PhysicsBody.addShape(
				new CANNON.Cylinder(
				phys_data.scale.rt * this.m_Parent.m_Scale.x,
				phys_data.scale.rb * this.m_Parent.m_Scale.x,
				phys_data.scale.h * this.m_Parent.m_Scale.y,
				phys_data.scale.s
				),
				new CANNON.Vec3(
				...Object.keys(phys_data.pos).map(
					dir => phys_data.pos[dir]
					* this.m_Parent.m_Scale[dir]
				)
				)
			);
			if(phys_data.rot)
			{
				this.m_PhysicsBody.shapeOrientations[
				this.m_PhysicsBody.shapeOrientations.length-1
				].setFromAxisAngle(
				new CANNON.Vec3(
					...Object.keys(phys_data.rot.axis).map(
					axis => phys_data.rot.axis[axis]
					)
				),
				phys_data.rot.r
				);
			}
			}
		});

		super.Initialise();
    }

    Remove()
    {
		ENGINE.m_World.m_PhysicsWorld.removeBody(this.m_PhysicsBody);
    }
}

export default OBJPhysicsComponent;