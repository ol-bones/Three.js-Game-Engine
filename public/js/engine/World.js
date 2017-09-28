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

	var walls = [];
	walls[0] = new Entity(-15,5,1);
	walls[0].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[0],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));

	walls[1] = new Entity(-15,5,-11);
	walls[1].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[1],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[2] = new Entity(-36,5,-5);
	walls[2].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[2],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, -100),
		new THREE.Vector3(0, 0, -100),
		new THREE.Vector3(-20, 100, -100),
		new THREE.Vector3(-20, 0, -100)
	    ]
	}));


	walls[3] = new Entity(4, 5, 20);
	walls[3].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[3],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 400),
		new THREE.Vector3(0, 0, 400),
		new THREE.Vector3(-20, 100, 400),
		new THREE.Vector3(-20, 0, 400)
	    ]
	}));


	walls[4] = new Entity(4, 5, -35);
	walls[4].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[4],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 500),
		new THREE.Vector3(0, 0, 500),
		new THREE.Vector3(-20, 100, 500),
		new THREE.Vector3(-20, 0, 500)
	    ]
	}));

	walls[5] = new Entity(16, 5, -30);
	walls[5].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[5],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 600),
		new THREE.Vector3(0, 0, 600),
		new THREE.Vector3(-20, 100, 600),
		new THREE.Vector3(-20, 0, 600)
	    ]
	}));


	walls[6] = new Entity(16, 5, 20);
	walls[6].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[6],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 200),
		new THREE.Vector3(0, 0, 200),
		new THREE.Vector3(-20, 100, 200),
		new THREE.Vector3(-20, 0, 200)
	    ]
	}));


	walls[7] = new Entity(35, 5, 5);
	walls[7].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[7],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 100),
		new THREE.Vector3(0, 0, 100),
		new THREE.Vector3(-20, 100, 100),
		new THREE.Vector3(-20, 0, 100)
	    ]
	}));


	walls[8] = new Entity(60, 5, 40);
	walls[8].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[8],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 400),
		new THREE.Vector3(0, 0, 400),
		new THREE.Vector3(-20, 100, 400),
		new THREE.Vector3(-20, 0, 400)
	    ]
	}));


	walls[9] = new Entity(19, 5, 25);
	walls[9].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[9],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 100),
		new THREE.Vector3(0, 0, 100),
		new THREE.Vector3(-20, 100, 100),
		new THREE.Vector3(-20, 0, 100)
	    ]
	}));


	walls[10] = new Entity(19, 5, 50);
	walls[10].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[10],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-20, 0, 0),
		new THREE.Vector3(-20, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 200),
		new THREE.Vector3(0, 0, 200),
		new THREE.Vector3(-20, 100, 200),
		new THREE.Vector3(-20, 0, 200)
	    ]
	}));



	walls[11] = new Entity(40, 5, 61);
	walls[11].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[11],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[12] = new Entity(40, 5, 19);
	walls[12].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[12],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[13] = new Entity(25, 5, 11);
	walls[13].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[13],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-200, 0, 0),
		new THREE.Vector3(-200, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-200, 0, 20),
		new THREE.Vector3(-200, 100, 20)
	    ]
	}));


	walls[14] = new Entity(25, 5, -1);
	walls[14].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[14],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-200, 0, 0),
		new THREE.Vector3(-200, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-200, 0, 20),
		new THREE.Vector3(-200, 100, 20)
	    ]
	}));


	walls[15] = new Entity(10, 5, -61);
	walls[15].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[15],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-100, 0, 0),
		new THREE.Vector3(-100, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-100, 0, 20),
		new THREE.Vector3(-100, 100, 20)
	    ]
	}));




	walls.forEach(wall => wall.Initialise());

	var f = new FloorGrid(5,0,40);
	f.Initialise();

	var p = new Entity(5, 5, -5);
	p.addComponent(new BasicBoxMeshRenderComponent({Parent: p}));
	p.addComponent(new GRIDPlayerControlComponent({Parent: p}));
	p.addComponent(new DebugComponent({Parent: p}));
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
