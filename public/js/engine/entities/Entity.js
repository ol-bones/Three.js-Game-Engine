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

	this.m_Parent = {};

	this.m_Components = {};
	this.m_Children = [];

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

    addChild(entity)
    {
	entity.m_Parent = this;
	this.m_Children.push(entity);
    }

    removeChild(entity)
    {
	delete this.m_Children[this.m_Children.indexOf(entity)];
	this.m_Children.splice(this.m_Children.indexOf(entity), 1);

    }

    addToWorld()
    {
	GAME.m_World.m_Entities.push(this);
	return true;
    }

    SetPosition(x,y,z)
    {
	this.m_Position.set(x,y,z);
	if(this.m_Components.PhysicsComponent)
	{
	    this.m_Components.PhysicsComponent.m_PhysicsBody.position.set(x,y,z);
	}
    }

    _SetPosition(x,y,z)
    {
	this.m_Position.set(x,y,z);
    }

    SetPositionX(x) { this.SetPosition(x, this.m_Position.y, this.m_Position.z); }
    SetPositionY(y) { this.SetPosition(this.m_Position.x, y, this.m_Position.z); }
    SetPositionZ(z) { this.SetPosition(this.m_Position.x, this.m_Position.y, z); }

    Update()
    {
	Object.keys(this.m_Components).forEach(c => this.m_Components[c].Update());
	if(this.m_Components.RenderComponent)
	{
	    this.m_Components.RenderComponent.SetPosition
	    (
		this.m_Position.x, this.m_Position.y, this.m_Position.z
	    );
	}
    }
}
