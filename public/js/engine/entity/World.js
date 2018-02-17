"use strict";

// Dependencies
// @Comms@
// @Entity@

class World extends mix(BaseObject).with(Comms)
{
    constructor()
    {
	super();

	this.m_EntityCount = 0;
	this.m_Entities = [];
	this.m_FlatEntities = [];
	this.m_Scene = {};
	this.m_EditorScene = {};

	this.m_Camera = {};

	this.m_Controls = {};
	this.m_LocalPlayer = {};

	this.m_PhysicsWorld = {};
	this.m_Renderer = {};
    }

    Initialise()
    {
	console.log(ENGINE);
	this.m_Entities = [];

	this.m_PhysicsWorld = new CANNON.World();
	this.m_PhysicsWorld.gravity.set(0, -6, 0);
	this.m_PhysicsWorld.broadphase = new CANNON.NaiveBroadphase();
	this.m_PhysicsWorld.solver.iterations = 50;
	this.m_Scene = new THREE.Scene();
	this.m_EditorScene = new THREE.Scene();
	this.m_DebugRenderer = new THREE.CannonDebugRenderer(this.m_Scene, this.m_PhysicsWorld);


	this.m_Camera = new THREE.PerspectiveCamera(
		70, window.innerWidth / window.innerHeight, 0.1, 10000
	);

	this.m_Renderer = new THREE.WebGLRenderer();
	this.m_Renderer.setClearColor(new THREE.Color(0x0, 0x0, 0x0));
	this.m_Renderer.setSize(window.innerWidth, window.innerHeight);
	this.m_Renderer.shadowMapEnabled = true;

	this.m_Camera.position.x = -30;
	this.m_Camera.position.y = 40;
	this.m_Camera.position.z = 30;
	this.m_Camera.lookAt(this.m_Scene.position);

	this.m_Controls = new THREE.OrbitControls( this.m_Camera, this.m_Renderer.domElement );

	this.m_Scene.fog = new THREE.FogExp2( 0xaabbbb, 0.001 );

	let light = new THREE.DirectionalLight( 0xffffff, 0.8 );
	light.position.set( -2000, 2000, -2000 );
	light.castShadow = true;
	light.shadow.camera.top = 1000;
	light.shadow.camera.right = 1000;
	light.shadow.camera.left = light.shadow.camera.bottom = -1000;
	light.shadow.camera.near = 1;
	light.shadow.camera.far = 3000;
	this.m_Scene.add( light );

	let ambientLight = new THREE.AmbientLight( 0xcccccc, 0.4 );
	this.m_Scene.add( ambientLight );

	document.getElementsByClassName("game-canvas")[0].appendChild(this.m_Renderer.domElement);

	requestAnimationFrame(this.render.bind(this));
    }

    Update()
    {
	this.ProcessInboundCommsQueue();
	this.m_PhysicsWorld.step(1/30);
//	this.m_DebugRenderer.update(); // only use this if shit is really weird

	this.m_Entities.forEach(e => e.Update());
    }

    // clean this eventually
    render()
    {
	this.m_Renderer.autoClear = false;
	this.m_Controls.update();

	this.m_Renderer.render(this.m_Scene, this.m_Camera);
	this.m_Renderer.clearDepth();
	this.m_Renderer.render(this.m_EditorScene, this.m_Camera);
	requestAnimationFrame(this.render.bind(this));
    }
}
