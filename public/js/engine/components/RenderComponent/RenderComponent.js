// Dependencies
// @Component@
// @BasicBoxMeshRenderComponent@

class RenderComponent extends mix(BasicBoxMeshRenderComponent).with()
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

	this.m_Mesh.m_ParentEntity = this.m_Parent || null;
	console.log("RenderComponent Initialise()");
    }

    Update()
    {
	console.log("RenderComponent Update();");
    }
}
