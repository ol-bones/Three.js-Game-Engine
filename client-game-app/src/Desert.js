import Entity from "./engine/entity/entities/Entity";

class Desert {
	constructor() {
		ENGINE.OnInitialised = () => this.Initialise();
	}

	Initialise() {
		this.LoadWorld();

		ENGINE.m_World.m_Camera.position.set(150, 170, -175);
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
					"pos": { "x": 525, "y": 170, "z": -675 },
					"rot": { "x": 0, "y": 0, "z": 0, "w": 1 },
					"parent": 0,
					"entities": [],
					"components":
					[
						{
							"args":
							{
								"Scale":
								{
									"x": 10,
									"y": 10,
									"z": 10
								}
							},
							"name":"BasicBoxMeshRenderComponent",
							"updateable":false
						},
						{
							"args": { "Type": 1, "BodySettings": { "type": "sphere", "radius": 2 } },
							"name": "BasicPhysicsComponent"
						},
						{
							"args": {},
							"name": "FPSPlayerControl"
						}
					],
				}, entities()[0], new THREE.Vector3(0, 0, 0));
		}
		catch (Exception) {
			setTimeout(this.LoadWorld.bind(this), 50);
		}
	}

	Update() {
	}
}

export default Desert;