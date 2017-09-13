// Dependencies
// @Entity@
// @BasicBoxMeshRenderComponent@

class FloorGrid extends Entity
{
    constructor(args)
    {
	super(args);
    }

    Initialise()
    {
	super.Initialise();

	for(var f = 0; f < 40; f++)
	{
	    for(var i = 0; i < 4; i++)
	    {
		var e = new Entity(this.m_Position.x + (i * 2.5) + (2.5/2),
				   this.m_Position.y,
				   this.m_Position.z - (2.5/2) - (f * 2.5));
		e.addComponent(new BasicBoxMeshRenderComponent(
		{
		    Parent: e,
		    Scale: new THREE.Vector3(2.5, 0.25 ,2.5)
		}));

		e.m_ClickFunctions.push((e)=>{GAME.m_World.m_LocalPlayer.m_Components.GRIDPlayerControlComponent.Activate(e)});

		e.Initialise();
		this.addChild(e);
	    }
	}
    }

    Update()
    {
	super.Update();
    }
}
