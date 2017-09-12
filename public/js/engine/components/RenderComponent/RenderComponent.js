// Dependencies
// @Component@
// @Entity@
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

	console.log("RenderComponent Initialise()");
    }

    Update()
    {
	console.log("RenderComponent Update();");
    }
}
