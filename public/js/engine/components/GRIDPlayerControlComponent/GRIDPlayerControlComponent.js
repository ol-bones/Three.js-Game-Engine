// Dependencies
// @Component@
// @Entity@

class GRIDPlayerControlComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "GRIDPlayerControlComponent";
    }

    Initialise()
    {
	super.Initialise();
    }

    Activate(entity)
    {
	console.log(entity);
    }

    Update()
    {
	super.Update();
    }
}
