class Game
{
    constructor()
    {
		this.m_Debug = true;
    }

    initialise()
    {
		console.log("Debugging: " + (this.m_Debug ? "enabled" : "disabled" ));
		
		this.m_World = new World();
		this.m_World.initialise();
    
		this.m_Mouse = new Mouse();
    }
	
	log(str)
	{
		if (this.m_Debug)
		{
			console.log(str);
		}
	}

}
