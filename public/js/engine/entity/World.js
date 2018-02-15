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

	var ambientLight = new THREE.AmbientLight(0x0c0c0c);
	this.m_Scene.add(ambientLight);
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-400, 300, -10);
	spotLight.castShadow = true;
	this.m_Scene.add(spotLight);

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
