// Dependencies
// @RenderComponent@

class BasicHullMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	var points = [];

	points[0] = new THREE.Vector3(0, 0, 0);
	points[1] = new THREE.Vector3(100, 0, 0);
	points[2] = new THREE.Vector3(100, 100, 0);
	points[3] = new THREE.Vector3(0, 100, 0);
	points[4] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);
	points[5] = new THREE.Vector3(Math.random()*100, 0, 100);
	points[6] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);
	points[7] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);

	this.m_Points = args.Points || points;
    }

    Initialise()
    {
	super.Initialise();
	var matBox = new THREE.MeshPhongMaterial( { color: 0xFFFFFF } );

	var geometry = new THREE.ConvexBufferGeometry(this.m_Points);
	geometry.center();

	var mat =
	(
	    this.m_Parent.m_Components.MaterialComponent
	) ?
	    this.m_Parent.m_Components.MaterialComponent.m_Material
	:
	    matBox
	;

	var mesh = new THREE.Mesh(geometry, mat);

	this.m_Mesh = mesh;
	this.SetPosition
	(
	    this.m_Parent.m_Position.x,
	    this.m_Parent.m_Position.y,
	    this.m_Parent.m_Position.z
	);

//	mesh.rotateX(-Math.PI/2);


	this.m_Mesh.m_ParentEntity = this.m_Parent || null;
	GAME.m_World.m_Scene.add(this.m_Mesh);
	this.m_IsInitialised = true;
    }

    Update()
    {
    }
}
