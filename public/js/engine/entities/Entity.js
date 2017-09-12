// Dependencies
// @BaseObject@
// @Movable@
// @Clickable@

class Entity extends mix(BaseObject).with(Movable, Clickable)
{
    constructor(x,y,z)
    {
	super();
	this.m_ID = GAME.m_World.m_Entities.length;
	this.addToWorld();

	this.m_Components = {};

	this.m_Position = new THREE.Vector3(x,y,z);

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
