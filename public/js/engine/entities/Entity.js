// Dependencies
// @BaseObject@

class Entity extends BaseObject
{
    constructor()
    {
	super();
	this.m_ID = GAME.m_World.m_Entities.length;
	this.addToWorld();

	console.log("entity constructor();");
    }

    addToWorld()
    {
	GAME.m_World.m_Entities.push(this);
    }
}
