// Dependencies
// @RenderComponent@

class BasicBoxMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	console.log("BasicBoxMeshRenderComponent constructor();");
    }

    Initialise()
    {
	super.Initialise();

	var matBox = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );

	var geoBox = new THREE.BoxGeometry( 2.5, 2.5, 2.5 );
	var mshBox = new THREE.Mesh(geoBox, matBox );

	this.m_Mesh = mshBox;
	this.m_Mesh.position.set
	(
	    this.m_Parent.m_Position.x,
	    this.m_Parent.m_Position.y,
	    this.m_Parent.m_Position.z
	);

	GAME.m_World.m_Scene.add(this.m_Mesh);
    }

    Update()
    {
	console.log("BasicBoxRenderComponent Update();");
    }
}
