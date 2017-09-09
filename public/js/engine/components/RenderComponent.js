// Dependencies
// @Component@

class RenderComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "RenderComponent";

	this.m_Mesh = args.Mesh || null;

	console.log("RenderComponent constructor()");
    }

    Initialise()
    {
	super.Initialise();

	var matBox = new THREE.MeshPhongMaterial( { color: 0xaaaaaa } );
	var geoBox = new THREE.BoxGeometry( 3, 1, 2 );
	var mshBox = new THREE.Mesh(geoBox, matBox );
	this.m_Mesh = mshBox;

	GAME.m_World.m_Scene.add(this.m_Mesh);

	console.log("RenderComponent Initialise()");
    }

    Update()
    {
	console.log("RenderComponent Update();");
    }
}
