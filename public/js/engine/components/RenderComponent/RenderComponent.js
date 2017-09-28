// Dependencies
// @Component@
// @Entity@
class RenderComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "RenderComponent";
	this.m_Parent.m_Renderable = true;

	this.m_Mesh = args.Mesh || null;

	this.m_Axis = {};

	console.log("RenderComponent constructor()");
    }

    Initialise()
    {
	super.Initialise();

	this.m_Axis = new THREE.AxisHelper(5);

	GAME.m_World.m_Scene.add(this.m_Axis);

	console.log("RenderComponent Initialise()");
    }

    SetPosition(x,y,z)
    {
	this.m_Mesh.position.set(x,y,z);
	this.m_Axis.position.set(x,y,z);
    }

    Update()
    {
    }
}
