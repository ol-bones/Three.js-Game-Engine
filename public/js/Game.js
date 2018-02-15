"use strict";

class Game
{
    constructor()
    {
	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	this.LoadWorld();

	ENGINE.m_World.m_Camera.position.set(-120.65558286328287,151.31431689725994,49.16004438380608);
	ENGINE.m_World.m_Camera.quaternion.set(-0.313321793870273,-0.638001400182456,-0.2988145120070227,0.6570095484000732);

    }

    LoadWorld()
    {
	try
	{
	    let data = json(`http://${CONFIG.host}/data/world/0.json`)
	    Entity.FromFile(
		data,
		null,
		new THREE.Vector3(0,0,0)
	    );

	    Entity.FromFile(
	    {
		"pos": {"x":0,"y":150,"z":50},
		"rot": {"x":0,"y":0,"z":0, "w":1},
		"parent":0,
		"entities":[],
		"components":
		[
		    {
			"args":
			{
			    "Radius": 2,
			    "Segments": 36
			},
			"name": "BasicSphereMeshRenderComponent"
		    },
		    {
			"args":{"Type":1,"BodySettings":{"type":"sphere","radius":2}},
			"name": "BasicPhysicsComponent"
		    },
		    {
			"args":{},
			"name": "MinigolfClientBallControlComponent"
		    }
		],
	    }, entities()[0], new THREE.Vector3(0,0,0));
	}
	catch(Exception)
	{
	    setTimeout(this.LoadWorld.bind(this), 50);
	}
    }

    Update()
    {
    }
}
