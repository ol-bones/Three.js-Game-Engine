"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class WASDPlayerControlComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Name = "WASDPlayerControlComponent";

		this.m_TargetPosition = {};
		this.m_Ray = {};

		this.m_PLControls = null;

		this.m_Keys =
		{
			W: false,
			A: false,
			S: false,
			D: false
		}
    }

    Initialise()
    {
		super.Initialise();
		
		this.m_PLControls = new THREE.PointerLockControls(
			ENGINE.m_World.m_Camera
		);
		
		ENGINE.m_World.m_Scene.add(this.m_PLControls.getObject());

		this.m_TargetPosition = this.m_Parent.m_Position.clone();
		this.m_Ray = new THREE.Raycaster();

		window.addEventListener('keydown', e =>
		{
			switch(e.keyCode)
			{
				case 87:
					e.preventDefault();
					this.m_Keys.W = true;
					break;
				case 65:
					e.preventDefault();
					this.m_Keys.A = true;
					break;
				case 83:
					e.preventDefault();
					this.m_Keys.S = true;
					break;
				case 68:
					e.preventDefault();
					this.m_Keys.D = true;
					break;
				default:
					break;
			}
		});

		window.addEventListener('keyup', e =>
		{
			switch(e.keyCode)
			{
				case 87:
					e.preventDefault();
					this.m_Keys.W = false;
					break;
				case 65:
					e.preventDefault();
					this.m_Keys.A = false;
					break;
				case 83:
					e.preventDefault();
					this.m_Keys.S = false;
					break;
				case 68:
					e.preventDefault();
					this.m_Keys.D = false;
					break;
				default:
					break;
			}
		});

		this.OnInitialised();
    }

    OnInitialised()
    {
		this.m_Arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 2.5, 0xFF0000);
		ENGINE.m_World.m_Scene.add(this.m_Arrow);
		this.m_IsInitialised = true;
    }

    Update()
    {
		this.m_Ray.ray.origin.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
		this.m_Ray.ray.direction = new THREE.Vector3(0, -1, 0);

		this.m_Arrow.position.set(this.m_Ray.ray.origin.x, this.m_Ray.ray.origin.y, this.m_Ray.ray.origin.z);

		if(this.m_Keys.W) { this.m_Ray.ray.origin.z += 2.5; }
		if(this.m_Keys.S) { this.m_Ray.ray.origin.z -= 2.5; }
		if(this.m_Keys.A) { this.m_Ray.ray.origin.x += 2.5; }
		if(this.m_Keys.D) { this.m_Ray.ray.origin.x -= 2.5; }

		let intersects = this.m_Ray.intersectObjects(entities().filter(e =>
e.m_Components.PhysicsComponent).map(e => e.m_Components.RenderComponent.m_Mesh));//.filter(e => e === this.m_Parent));

		this.m_TargetPosition = this.m_Parent.m_Position.clone();
		if(intersects.length > 0)
		{
		   if(this.m_Keys.W) { this.m_TargetPosition.z += 2.5; }
		   if(this.m_Keys.S) { this.m_TargetPosition.z -= 2.5; }
		   if(this.m_Keys.A) { this.m_TargetPosition.x += 2.5; }
		   if(this.m_Keys.D) { this.m_TargetPosition.x -= 2.5; }

		   let arrow_pos = new THREE.Vector3(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
		   this.m_Arrow.position.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
		   this.m_Arrow.setDirection((arrow_pos.sub(intersects[0].point)).normalize().multiplyScalar(-1));
		   this.m_Arrow.setLength(this.m_Arrow.position.distanceTo(intersects[0].point));

		    let force = (this.m_TargetPosition.clone().sub(this.m_Parent.m_Position.clone())).multiplyScalar(100);

			const keysPressed = !!Object.keys(this.m_Keys)
				.map(k => this.m_Keys[k])
				.reduce((a,k) => a+k);

		    if(keysPressed)
		    {
				this.m_Parent.SendComms
				(
					{ ID: 2, Component: "PhysicsComponent" },
					[ force.x, force.y, force.z ],
					"ApplyForce",
					0
				);
			}
			else
			{
				const pbb = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody;
				const vv = pbb.velocity;
				pbb.velocity.set(
					vv.x * 0.9,
					vv.y,
					vv.z * 0.9
				);
			}

			const pb = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position;
			this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position.y = (intersects[0].point.y + 50);
			ENGINE.m_World.m_Camera.position.set(pb.x, pb.y, pb.z);
		}
    }
}

export default WASDPlayerControlComponent;