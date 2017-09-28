// Dependencies
// @Entity@
// @Game@

class World
{
    constructor()
    {
	this.m_Entities = [];
	this.m_Scene = {};

	this.m_Camera = {};

	this.m_Controls = {};
	this.m_LocalPlayer = {};


	this.m_Renderer = {};
    }

    initialise()
    {
	console.log(GAME);
	this.m_Entities = [];

	this.m_Scene = new THREE.Scene();

	var k = new Entity(0,0,0);
	k.addComponent(new BasicShapeMeshRenderComponent({Parent: k}));
	k.Initialise();

	var Points = [];
	    Points[0] = new THREE.Vector2(0, 0);
	    Points[1] = new THREE.Vector2(400, 0);
	    Points[2] = new THREE.Vector2(400, 400);
	    Points[3] = new THREE.Vector2(0, 400);

	var l = new Entity(40,0,40);
	l.addComponent(new BasicShapeMeshRenderComponent({Parent: l, Points: Points}));
	l.Initialise();

	var Points2 = [];
	    Points2[0] = new THREE.Vector2(0, 0);
	    Points2[1] = new THREE.Vector2(50, 0);
	    Points2[2] = new THREE.Vector2(50, 100);
	    Points2[3] = new THREE.Vector2(0, 100);

	var o = new Entity(17.5,0,35);
	o.addComponent(new BasicShapeMeshRenderComponent({Parent: o, Points: Points2}));
	o.Initialise();

	var u = new Entity(10,5,45);
	u.addComponent(new BasicHullMeshRenderComponent({Parent: u}));
	u.Initialise();


	var f = new FloorGrid(5,0,40);
	f.Initialise();

	var p = new Entity(5, 5, -5);
	p.addComponent(new BasicBoxMeshRenderComponent({Parent: p}));
	p.addComponent(new GRIDPlayerControlComponent({Parent: p}));
	p.Initialise();

	this.m_LocalPlayer = p;

	this.m_Camera = new THREE.PerspectiveCamera(
	    70, window.innerWidth / window.innerHeight, 0.1, 10000
	);

	this.m_Renderer = new THREE.WebGLRenderer();
	this.m_Renderer.setClearColor(new THREE.Color(0x0, 0x0, 0x0));
	this.m_Renderer.setSize(window.innerWidth, window.innerHeight);
	this.m_Renderer.shadowMapEnabled = true;

	// create the ground plane
	var planeGeometry = new THREE.PlaneGeometry(60, 40, 1, 1);
	var planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff});
	var plane = new THREE.Mesh(planeGeometry, planeMaterial);
	plane.receiveShadow = true;

	// rotate and position the
	// plane
	plane.rotation.x = -0.5 * Math.PI;
	plane.position.x = 0;
	plane.position.y = 0;
	plane.position.z = 0;
	// add
	// the
	// plane
	// to
	// the
	// scene
//	this.m_Scene.add(plane);
	// position
	// and
	// point
	// the
	// camera
	// to
	// the
	// center
	// of
	// the
	// scene
	this.m_Camera.position.x = -30;
	this.m_Camera.position.y = 40;
	this.m_Camera.position.z = 30;
	this.m_Camera.lookAt(this.m_Scene.position);

	this.m_Controls = new THREE.OrbitControls( this.m_Camera, this.m_Renderer.domElement );

	// add
	// subtle
	// ambient
	// lighting
	var ambientLight = new THREE.AmbientLight(0x0c0c0c);
	this.m_Scene.add(ambientLight);
	// add
	// spotlight
	// for
	// the
	// shadows
	var spotLight = new THREE.SpotLight(0xffffff);
	spotLight.position.set(-40, 60, -10);
	spotLight.castShadow = true;
	this.m_Scene.add(spotLight);

        document.getElementsByClassName("game-canvas")[0].appendChild(this.m_Renderer.domElement);

	requestAnimationFrame(this.render.bind(this));
	setInterval(this.Update.bind(this), 1000/30);
    }

    Update()
    {
	this.m_Entities.forEach(e => e.Update());
    }

    render()
    {
	this.m_Controls.update();
	this.m_Renderer.render(this.m_Scene, this.m_Camera);
	requestAnimationFrame(this.render.bind(this));
    }
}
