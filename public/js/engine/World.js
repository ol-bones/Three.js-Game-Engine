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
	this.m_Renderer = {};
    }

    initialise()
    {
	console.log(GAME);
	this.m_Entities = [];

	this.m_Scene = new THREE.Scene();

	var k = new Entity();

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
	this.m_Scene.add(plane);
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
    }

    render()
    {
	this.m_Renderer.render(this.m_Scene, this.m_Camera);
	requestAnimationFrame(this.render.bind(this));
    }
}