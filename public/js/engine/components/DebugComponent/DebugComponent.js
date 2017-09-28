// Dependencies
// @Component@
// @Entity@
class DebugComponent extends mix(Component).with()
{
    constructor(args)
    {
		super(args);

		this.m_Name = "DebugComponent";
		this.m_Axis = {};
    }

    Initialise()
    {
		super.Initialise();

		this.m_Axis = new THREE.AxisHelper(5);
		GAME.m_World.m_Scene.add(this.m_Axis);
    }
	
	SetPosition(x,y,z)
    {
		if (this.m_Axis.position)
		{
			this.m_Axis.position.set(x,y,z);
		}
    }

    Update()
    {
    }
}
