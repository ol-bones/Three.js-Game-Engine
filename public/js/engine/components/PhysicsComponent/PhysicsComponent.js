// Dependencies
// @Component@
// @Entity@

class PhysicsComponent extends mix(Component).with()
{

    constructor(args)
    {
	super(args);

	this.m_Name = "PhysicsComponent";

	this.m_PhysicsBody = {};
	this.m_BodySettings = args.BodySettings ||
	{
	    type:'cylinder',
	    size:[1, 1, 1],
	    pos:[this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z],
	    move:false
	};

	this.m_BodySettings.world = GAME.m_World.m_PhysicsWorld;
    }

    Initialise()
    {
	super.Initialise();

	this.m_PhysicsBody = this.m_BodySettings.world.add(
	{
	    type: this.m_BodySettings.type,
	    size: this.m_BodySettings.size,
	    pos: this.m_BodySettings.pos,
	    move: this.m_BodySettings.move,
	    world: this.m_BodySettings.world
	});

    }

    Update()
    {
	let body_pos = this.m_PhysicsBody.getPosition();
	this.m_Parent.SetPosition(body_pos.x, body_pos.y, body_pos.z);
    }
}
