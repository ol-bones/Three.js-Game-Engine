
// Dependencies

class Component
{
    constructor(args)
    {
	this.m_Name = "Component";
	this.m_Parent = args.Parent || null;
	this.m_Updateable = args.Updateable || false;

	console.log("Component constructor()");
}

    Initialise()
    {
	console.log("Component Initialise()");
    }

    Update()
    {

    }
}
