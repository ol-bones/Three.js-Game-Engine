import * as THREE from "three";
import Entity from "./engine/entity/entities/Entity";

class Desert {
	constructor() {
		ENGINE.OnInitialised = () => this.Initialise();
	}

	Initialise() {
		this.LoadWorld();

		ENGINE.m_World.m_Camera.position.set(150, 170, -175);
	}

	OnInitialised()
	{
		setInterval(this.Update.bind(this), 1000/5);
	}

	LoadWorld() {
		try {
			let data = json(`/data/desert/1.json`);

			Entity.FromFile(
				data,
				null,
				new THREE.Vector3(0, 0, 0)
			);

			Entity.FromFile(
				{
					"pos": { "x": 1200, "y": 100, "z": -535 },
					"rot": { "x": 0, "y": 0, "z": 0, "w": 1 },
					"scale":
					{
						"x": 10,
						"y": 10,
						"z": 10
					},
					"parent": 0,
					"entities": [],
					"components":
					[
						{
							"args": {},
							"name":"BasicBoxMeshRenderComponent",
							"updateable":false
						},
						{
							"args":
							{
								"Type": 1,
								"BodySettings":
								{
									"type": "sphere",
									"radius": 20,
									"material":
									{
										"friction": 0,
										"restitution": 3,
										"stiffness": 1e8,
										"relaxation": 3,
										"frictionstiffness": 1e12
									},
									"mass": 2,
									"angularDamping": 0.1,
									"linearDamping": 0.925,
									"fixedRotation": true
								}
							},
							"name": "BasicPhysicsComponent"
						},
						{
							"args": {},
							"name": "FPSPlayerControl"
						}
					],
				}, entities()[0], new THREE.Vector3(0, 0, 0));
		}
		catch (e) {
			console.log(e);
			setTimeout(this.LoadWorld.bind(this), 50);
			return;
		}

		this.OnInitialised();
	}

	Update() {
		try
		{
			const IntroBoatTrainEntity = entities().find(e => e.m_Components.BasicTrainComponent);
			const IntroBoatPassengerEntity = entities().find(e => e.m_Components.VehiclePassengerComponent);
			const PlayerControlsEntity = entities().find(e => e.m_Components.FPSPlayerControl);
	
			const IntroBoatInitialised = IntroBoatTrainEntity != void(0) && IntroBoatTrainEntity.m_Components != void(0) && IntroBoatTrainEntity.m_Components.BasicTrainComponent != void(0);
			const IntroBoatPassengerInitialised = IntroBoatPassengerEntity != void(0) && IntroBoatPassengerEntity.m_Components != void(0) && IntroBoatPassengerEntity.m_Components.VehiclePassengerComponent != void(0);
			const PlayerControlsInitialised = PlayerControlsEntity !== null && PlayerControlsEntity.m_Components != void(0) && PlayerControlsEntity.m_Components.FPSPlayerControl != void(0);

			const IntroBoatComponent = IntroBoatTrainEntity.m_Components.BasicTrainComponent;
			const IntroBoatPassengerComponent = IntroBoatTrainEntity.m_Components.VehiclePassengerComponent;
			const PlayerControlComponent = PlayerControlsEntity.m_Components.FPSPlayerControl;

			if(IntroBoatInitialised && IntroBoatComponent.m_Finished && IntroBoatPassengerComponent.m_IsSeated)
			{
					IntroBoatPassengerComponent.Exit();
					PlayerControlsEntity.SetPosition(
						1200,
						100,
						-535,
						true
					);
			}
		}
		catch (e) { console.error(e); }
	}
}

export default Desert;