// Dependencies
// @BaseObject@

class Entity extends mix(BaseObject).with(Movable, Clickable)
{
    constructor()
    {
	super();
	this.m_ID = GAME.m_World.m_Entities.length;
	this.addToWorld();

	this.m_Components = {};

	this.m_Position = new THREE.Vector3(0,0,0);

	console.log("entity constructor();");
    }

    Initialise()
    {
	this._InitialiseComponents();
    }

    _InitialiseComponents()
    {
	Object.keys(this.m_Components).forEach((key) => this.m_Components[key].Initialise());
    }

    addComponent(component)
    {
	this.m_Components[component.m_Name] = component;
	return true;
    }

    removeComponent(component)
    {
	if(typeof component === "string")
	{
	    delete this.m_Components[component];
	    return true;
	}
	return false;
    }

    addToWorld()
    {
	GAME.m_World.m_Entities.push(this);
	return true;
    }
}
