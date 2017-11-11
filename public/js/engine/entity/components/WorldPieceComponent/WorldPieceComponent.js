// Dependencies
// @Component@

class WorldPieceComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "WorldPieceComponent";
	this.m_PieceOrigin = this.m_Parent.m_Position;
    }

    Initialise()
    {
	super.Initialise();


	this.onInitialised();
    }

    Update()
    {
    }
}
