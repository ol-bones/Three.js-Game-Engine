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
		this.m_GunFlash = null;
		this.m_GunFlashState = false;
		this.m_CanJump = true;

		this.m_EyeNormal = new THREE.Vector3();
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
		window.addEventListener("mousedown", this.onFire.bind(this), false);

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
		this.m_Canvas = document.querySelector("canvas");
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
						"texture":  "/gun.png"
					},
					"name":"OBJRenderComponent",
					"updateable":false
				}
			]
		}, this.m_Parent, new THREE.Vector3(0,0,0));


		this.m_GunFlash = Entity.FromFile(
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
						"model": "gunflash.obj",
						"texture":  "/2.png"
					},
					"name":"OBJRenderComponent",
					"updateable":false
				}
			]
		}, this.m_Parent, new THREE.Vector3(0,0,0));
    }

    Jump()
    {
		if(this.m_CanJump)
		{
			this.m_CanJump = false;
			this.m_Parent.m_Components.PhysicsComponent.ApplyForce(
				0, 6000, 0
			);

			setTimeout(() => this.m_CanJump = true, 1000);
		}
	}
	
	// unit vector, not angle
	GetDirection()
	{
		try
		{
			return ENGINE.m_World.m_Camera.getWorldDirection(this.m_EyeNormal);
		} catch(e) { return new THREE.Vector3(); }
	}

    Update()
    {
		if(this.m_GunFlash.m_Components.RenderComponent.m_Mesh)
		{
			this.m_GunFlash.m_Components.RenderComponent.m_Mesh.visible = this.m_GunFlashState;
		}
		
		const force = new THREE.Vector2();
		if(this.m_MovementKeyStates["w"]) { force.x += 390; }
		if(this.m_MovementKeyStates["a"]) { force.y -= 390; }
		if(this.m_MovementKeyStates["s"]) { force.x -= 390; }
		if(this.m_MovementKeyStates["d"]) { force.y += 390; }

		const dir = this.GetDirection().clone();
		const cr = new THREE.Vector2(dir.x, dir.z);
		const angle = cr.angle();
		force.rotateAround(new THREE.Vector2(0,0), angle);
		
		this.m_Parent.m_Components.PhysicsComponent.ApplyForce(
			force.x, 0, force.y
		);

		const pb = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody.position;
		ENGINE.m_World.m_Camera.position.set(pb.x, pb.y + 64, pb.z);
		
		const gunPos = new THREE.Vector3(pb.x, pb.y + 64, pb.z);
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
		this.m_GunFlash.SetPosition(gunPos.x, gunPos.y - 0.25, gunPos.z);
		if(rot && rot.x && rot.y && rot.z)
		{
			this.m_Gun.SetRotation(rot.x, rot.y, rot.z);
			this.m_GunFlash.SetRotation(rot.x, rot.y, rot.z);
		}
	}
	
	onFire(evt)
	{
		try
		{
			if(this.m_GunFlashState === false)
			{
				this.m_GunFlashState = true;
				setTimeout(() => this.m_GunFlashState = false, 50);
			}

			this.m_Ray = new THREE.Raycaster();

			this.m_ScreenPosition = new THREE.Vector2(0,0);
			this.m_WorldPosition = new THREE.Vector3(0,0,0);

			let width = this.m_Canvas.width;
			let height = this.m_Canvas.height;
	
			this.m_ScreenPosition.x = ( evt.layerX / width  ) * 2 - 1;
			this.m_ScreenPosition.y = -( evt.layerY / height ) * 2 + 1;
	
			this.m_Ray.setFromCamera(this.m_ScreenPosition, ENGINE.m_World.m_Camera);
	
			let intersects = this.m_Ray.intersectObjects(_.flatten(entities()
				.filter(e => e.m_Renderable && e.m_Components.RenderComponent && e.m_Components.RenderComponent.m_Meshes)
				.map(e => e.m_Components.RenderComponent.m_Meshes))
			);

			if(intersects.length > 0 && intersects[0].object.m_ParentEntity.m_Components.PhysicsComponent.m_BodySettings.type === "sphere")
			{
				this.m_WorldPosition.set
				(
					intersects[0].point.x,
					intersects[0].point.y,
					intersects[0].point.z
				);

				const obj = intersects[0].object;
				const dir = this.GetDirection().clone();
				const cr = new THREE.Vector2(dir.x, dir.z);
				const angle = cr.angle();
				const force = new THREE.Vector2(1,1);
				force.rotateAround(new THREE.Vector2(0,0), angle).multiplyScalar(2000);
				
				obj.m_ParentEntity.m_Components.PhysicsComponent.ApplyForce(
					force.x, 5, force.y
				);
			}
		} catch(e) {}
	}
}

export default FPSPlayerControl;