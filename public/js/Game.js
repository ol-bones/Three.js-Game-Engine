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

	    var cubeTextureLoader = new THREE.CubeTextureLoader();
	    cubeTextureLoader.setPath( 'textures/cube/skyboxsun/' );

	    let cubeMap = cubeTextureLoader.load( [
		'px.jpg', 'nx.jpg',
		    'py.jpg', 'ny.jpg',
		    'pz.jpg', 'nz.jpg',
		] );

	    ENGINE.m_World._cube = cubeMap;

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


	    var waterGeometry = new THREE.PlaneBufferGeometry(1000, 1000);
	    let water_normal_map = texture("/waternormals.jpg")
	    water_normal_map.wrapS = THREE.RepeatWrapping;
	    water_normal_map.wrapT = THREE.RepeatWrapping;

	    let water = new THREE.Water
	    (
		waterGeometry,
		{
		    textureWidth: 512,
		    textureHeight: 512,
		    waterNormals: water_normal_map,
		    alpha: 1,
		    sunDirection: new THREE.Vector3(-200,200,-200).normalize(),
		    sunColor: 0xffffff,
		    waterColor: 0x001e0f,
		    distortionScale: 3.7,
		    fog: ENGINE.m_World.m_Scene.fog !== undefined
		}
	    );

	    water.rotation.x = -Math.PI / 2;
	    water.receiveShadow = true;

	    ENGINE.m_World.m_Scene.add( water );

	    var cubeShader = THREE.ShaderLib[ 'cube' ];
	    cubeShader.uniforms[ 'tCube' ].value = cubeMap;

	    var skyBoxMaterial = new THREE.ShaderMaterial( {
				    fragmentShader: cubeShader.fragmentShader,
				    vertexShader: cubeShader.vertexShader,
				    uniforms: cubeShader.uniforms,
				    side: THREE.BackSide
				} );

	    var skyBoxGeometry = new THREE.BoxBufferGeometry(
				    5000,
				    5000,
				    5000 );

	    var skyBox = new THREE.Mesh( skyBoxGeometry, skyBoxMaterial );

	    ENGINE.m_World.m_Scene.add( skyBox );
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
