class Game
{

    constructor()
    {
    }

    initialise()
    {
	this.m_World = new World();
	this.m_World.initialise();
    
	this.m_Mouse = new Mouse();


    }

}
