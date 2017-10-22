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
    }

    Initialise()
    {
		super.Initialise();
    }

    SetPosition(x,y,z)
    {
		this.m_Mesh.position.set(x,y,z);
		if(this.m_Parent.m_Components.DebugComponent)
		{
			this.m_Parent.m_Components.DebugComponent.SetPosition(x,y,z);
		}
    }

    Update()
    {
    }
}
