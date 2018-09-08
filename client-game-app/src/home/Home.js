"use strict";

import Entity from "./../engine/entity/entities/Entity";

class Home
{
    constructor()
    {
		this.m_UpdateIntervalID = -1;
		ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
		ENGINE.m_World.m_Camera.position.set(-140.65558286328287, 101.31431689725994, 149.16004438380608);
		ENGINE.m_World.m_Camera.quaternion.set(-0.313321793870273, 0.638001400182456, 1.2988145120070227, 0.6570095484000732);
		Entity.FromFile(
		{
			"pos":
			{
				"x":15,
				"y":45,
				"z":125
			},
			"rot":
			{
				"x":0,
				"y":0,
				"z":0,
				"w":1
			},
			"parent":0,
			"entities":[],
			"components":
			[
				{
					"args":
					{
					"Scale":
					{
						"x": 2.5,
						"y": 2.5,
						"z": 2.5
					}
					},
					"name":"BasicBoxMeshRenderComponent",
					"updateable":false
				}
			]
		}, entities()[0], new THREE.Vector3(0,0,0));
		this.m_UpdateIntervalID = setInterval(this.Update, 1000/60);
	}

	Destroy()
	{
		clearInterval(this.m_UpdateIntervalID);
	}

	Update()
	{
		try
		{
			entities()[0].SetRotationY(entities()[0].m_Rotation.y + 0.01);
			entities()[0].SetRotationZ(entities()[0].m_Rotation.z + 0.01);
		}
		catch(e) {}
	}
}

export default Home;