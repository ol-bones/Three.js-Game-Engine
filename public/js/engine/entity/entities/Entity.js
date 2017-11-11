// Dependencies
// @BaseObject@
// @Movable@
// @Clickable@
// @Savable@

class Entity extends mix(BaseObject).with(Movable, Clickable, Savable)
{
    constructor(x,y,z)
    {
	super();

	this.m_ID = Entity._idGenerator();

	this.m_Parent = {};

	this.m_Components = {};
	this.m_Children = [];

	this.__IsInitialised = false;

	this.m_Position = new THREE.Vector3(x,y,z);
    }

    Initialise()
    {
	this._InitialiseComponents();
    }

    onInitialised()
    {
	entities().push(this);
    }

    _InitialiseComponents()
    {
	if(Object.keys(this.m_Components).length === 0)
	{
	    if(!this.IsInitialised())
	    {
		this.__IsInitialised = true;
		this.onInitialised(this);
	    }
	}
	else if(!this.IsInitialised() && this._IsInitialised())
	{
		this.__IsInitialised = true;
		this.onInitialised(this);
	}

	Object.keys(this.m_Components)
	    .filter(key => !this.m_Components[key].m_IsInitialised)
	    .filter(key =>
	    {
		return (this.IsFirstComponent(key)
		||
		this.PreviousComponent(key).m_IsInitialised);
	    })
	    .forEach((key) => this.m_Components[key].Initialise());
    }

    IsInitialised() { return this.__IsInitialised; }

    _IsInitialised()
    {
	return (Object.keys(this.m_Components)
	    .filter(key => this.m_Components[key].m_IsInitialised))
	    .length === this.ComponentCount();
    }

    IsFirstComponent(componentName)
    {
	return (Object.keys(this.m_Components).indexOf(componentName) === 0);
    }

    PreviousComponent(componentName)
    {
	let prevComponentIndex = this.PreviousComponentIndex(componentName);
	let componentKeys = Object.keys(this.m_Components);
	let previousComponentKey = componentKeys[prevComponentIndex];

	let previousComponent = this.m_Components[previousComponentKey];

	return previousComponent;
    }

    PreviousComponentIndex(componentName)
    {
	return Object.keys(this.m_Components).indexOf(componentName) - 1;
    }

    ComponentCount()
    {
	return Object.keys(this.m_Components).length;
    }

    addComponent(component)
    {
	this.m_Components[component.m_Name] = component;
	this.__IsInitialised = false;
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
	if(this.IsInitialised())
	{
	    Object.keys(this.m_Components).forEach(c => this.m_Components[c].Update());
	    if(this.m_Components.RenderComponent)
	    {
		this.m_Components.RenderComponent.SetPosition
		(
		    this.m_Position.x, this.m_Position.y, this.m_Position.z
		);
	    }
	    this.m_Children.forEach(e => e.Update());
	}
	else
	{
	    this._InitialiseComponents();
	}
    }

    DataModel()
    {
	return new EntityModel(this);
    }
}

Entity._idCount = 0;

Entity._idGenerator = () => Entity._idCount++;

Entity.FromFile = (json) =>
{
    let entity = new Entity(json.pos.x, json.pos.y, json.pos.z);
    try
    {
	entities().find(e => e.m_ID === Number(json.parent)).addChild(entity);
    }
    catch(e)
    {
	GAME.m_World.m_Entities.push(entity);
    }
    finally
    {
	json.components.forEach(c =>
	{
	    c.args.Parent = entity;
	    entity.addComponent(Component.FromFile(c));
	});
	json.children.forEach(c => Entity.FromFile(c));
	return entity;
    }
};
















