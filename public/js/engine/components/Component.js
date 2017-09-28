
// Dependencies

class Component
{
    constructor(args)
    {
		this.m_Args = args;

		this.m_Name = "Component";
		this.m_Parent = args.Parent || null;
		this.m_Updateable = args.Updateable || false;
}

    Initialise()
    {
    }

    Update()
    {
    }
}
