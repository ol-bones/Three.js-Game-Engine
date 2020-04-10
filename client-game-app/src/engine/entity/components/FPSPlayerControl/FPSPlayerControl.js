"use strict";

import Entity from "../../entities/Entity";
import Component from "../Component";
import {mix} from "mixwith";

class FPSPlayerControl extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Canvas = document.querySelector("canvas");
		
		this.m_Name = "FPSPlayerControl";

		this.m_MovementKeyStates = {
			"w": false,
			"s": false,
			"a": false,
			"s": false
		};

		this.m_PLControls = null;

		this.m_Gun = null;
    }

    Initialise()
    {
		this.RegisterKeyEvents();
		this.m_PLControls = new THREE.PointerLockControls(
			ENGINE.m_World.m_Camera
		);
		
		ENGINE.m_World.m_Scene.add(this.m_PLControls.getObject());
		
		super.Initialise();
		this.OnInitialised();
	}
	
	RegisterKeyEvents()
	{
		window.addEventListener("keydown", (e) =>
		{
			const key = e.key;
			const held = e.repeat;

			if(key === "w") this.m_MovementKeyStates["w"] = true;
			if(key === "a") this.m_MovementKeyStates["a"] = true;
			if(key === "s") this.m_MovementKeyStates["s"] = true;
			if(key === "d") this.m_MovementKeyStates["d"] = true;
			if(key === ' ') return this.Jump();

		}, false);

		window.addEventListener("keyup", (e) =>
		{
			const key = e.key;

			if(key === "w") this.m_MovementKeyStates["w"] = false;
			if(key === "a") this.m_MovementKeyStates["a"] = false;
			if(key === "s") this.m_MovementKeyStates["s"] = false;
			if(key === "d") this.m_MovementKeyStates["d"] = false;

		}, false);
	}

    OnInitialised()
    {
		this.m_IsInitialised = true;

		this.m_Gun = Entity.FromFile(
		{
			"pos":
			{
				"x":0,
				"y":0,
				"z":0
			},
			"rot":
			{
				"x":0,
				"y":0,
				"z":0,
				"w":1
			},
			"parent": this.m_Parent.m_ID,
			"entities": [],
			"components":
			[
				{
					"args":
					{
						"Scale":
						{
							"x": 1,
							"y": 1,
							"z": 1
						},
						"model": "gun.obj",
						"texture":  "/poker_chair.jpg"
					},
					"name":"OBJRenderComponent",
					"updateable":false
				}
			]
		}, this.m_Parent, new THREE.Vector3(0,0,0));
    }

    Jump()
    {
		this.m_Parent.m_Components.PhysicsComponent.ApplyForce(
			0, 200, 0
		);
	}
	
	// unit vector, not angle
	GetDirection()
	{
		try
		{
			return ENGINE.m_World.m_Camera.getWorldDirection();
		} catch(e) { return new THREE.Vector3(); }
	}

    Update()
    {
		/*
		let m = ENGINE.m_Mouse.m_WorldPosition.clone();
		const mworld = ENGINE.m_Mouse.m_WorldPosition.clone();
		m.y = this.m_Parent.m_Position.y;
		this.m_Dir = m.sub(this.m_Parent.m_Position).normalize();
		this.m_Length = Math.min(Math.max(mworld.distanceTo(this.m_Parent.m_Position), 0), 110);
		this.m_Arrow.setLength(this.m_Length, 0, 0);
		this.m_Arrow.setDirection(this.m_Dir);
		this.m_Arrow.position.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
		*/

		const force = new THREE.Vector2();
		if(this.m_MovementKeyStates["w"]) { force.x += 85; }
		if(this.m_MovementKeyStates["a"]) { force.y -= 85; }
		if(this.m_MovementKeyStates["s"]) { force.x -= 85; }
		if(this.m_MovementKeyStates["d"]) { force.y += 85; }

		const dir = this.GetDirection().clone();
		const cr = new THREE.Vector2(dir.x, dir.z);
		const angle = cr.angle();
		force.rotateAround(new THREE.Vector2(0,0), angle);
		
		this.m_Parent.m_Components.PhysicsComponent.ApplyForce(
			force.x, 0, force.y
		);

		const pb = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position;
		ENGINE.m_World.m_Camera.position.set(pb.x, pb.y, pb.z);
		
		const gunPos = new THREE.Vector3(pb.x, pb.y, pb.z);
		const eyeDir = new THREE.Vector3(dir.x, dir.y, dir.z);
		
		let m = new THREE.Matrix4().lookAt( eyeDir, new THREE.Vector3(), new THREE.Vector3(0, 1, 0) );
		let q = new THREE.Quaternion().setFromRotationMatrix( m );
		let rot = new THREE.Euler().setFromQuaternion(q);

		const gunOffset = eyeDir.multiplyScalar(2);


		
		const handOFfset = eyeDir.clone();
		handOFfset.setY(0);
		gunOffset.add(handOFfset.cross(new THREE.Vector3(0, 1, 0)).normalize().multiplyScalar(2));

		gunPos.add(gunOffset);

		this.m_Gun.SetPosition(gunPos.x, gunPos.y - 0.25, gunPos.z);
		if(rot && rot.x && rot.y && rot.z)
		{
			this.m_Gun.SetRotation(rot.x, rot.y, rot.z);
		}
    }
}

export default FPSPlayerControl;