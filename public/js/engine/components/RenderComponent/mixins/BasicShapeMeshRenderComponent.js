// Dependencies
// @RenderComponent@

class BasicShapeMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	var points = [];

	points[0] = new THREE.Vector2(0, 0);
	points[1] = new THREE.Vector2(100, 0);
	points[2] = new THREE.Vector2(100, 300);
	points[3] = new THREE.Vector2(300, 300);
	points[4] = new THREE.Vector2(300, 400);
	points[5] = new THREE.Vector2(100, 400);
	points[6] = new THREE.Vector2(100, 800);
	points[7] = new THREE.Vector2(0, 800);
	points[8] = new THREE.Vector2(0, 500);
	points[9] = new THREE.Vector2(-400, 500);
	points[10] = new THREE.Vector2(-400, 400);
	points[11] = new THREE.Vector2(0, 400);
	points[12] = new THREE.Vector2(0, 0);


	this.m_Points = args.Points || points;

	console.log("BasicShapeMeshRenderComponent constructor();");
    }

    Initialise()
    {
	super.Initialise();
	var matBox = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

	var roadShape = new THREE.Shape(this.m_Points);

	var geometry = new THREE.ShapeBufferGeometry(roadShape);
	geometry.center();
	var mesh = new THREE.Mesh(geometry, matBox);

	mesh.scale.set(0.1, 0.1, 0.1);

	mesh.rotateX(-Math.PI/2);

	this.m_Mesh = mesh;
	this.SetPosition
	(
	    this.m_Parent.m_Position.x,
	    this.m_Parent.m_Position.y,
	    this.m_Parent.m_Position.z
	);

	this.m_Mesh.m_ParentEntity = this.m_Parent || null;
	GAME.m_World.m_Scene.add(this.m_Mesh);
    }

    Update()
    {
    }
}
