"use strict";

// Dependencies
// @BaseObject@
// @Comms@
// @Movable@
// @Clickable@
// @Savable@

class Entity extends mix(BaseObject).with(Comms, Movable, Clickable, Savable)
{
    constructor(x,y,z)
    {
	super();

	this.m_ID = Entity._idGenerator();

	this.m_Parent = {};

	this.m_Components = {};
	this.m_Entities = [];

	this.__IsInitialised = false;

	this.m_Position = new THREE.Vector3(x,y,z);
    }

    saywhat() { console.log(this.m_ID + " says what"); }

    Initialise()
    {
	this._InitialiseComponents();
    }

    OnInitialised()
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
		this.OnInitialised(this);
	    }
	}
	else if(!this.IsInitialised() && this._IsInitialised())
	{
		this.__IsInitialised = true;
		this.OnInitialised(this);
	}

	Object.keys(this.m_Components)
	    .filter(key => !this.m_Components[key].m_IsInitialised)
	    .filter(key =>
	    {
		return (this.IsFirstComponent(key)
		||
		this.PreviousComponent(key).m_IsInitialised);
	    })
	    .forEach((key) => {try{this.m_Components[key].Initialise();}catch(e){}});
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

    AddComponent(component)
    {
	this.m_Components[component.m_Name] = component;
	this.__IsInitialised = false;
	return true;
    }

    RemoveComponent(component)
    {
	if(typeof component === "string")
	{
	    delete this.m_Components[component];
	    return true;
	}
	return false;
    }

    AddChild(entity)
    {
	entity.m_Parent = this;
	this.m_Entities.push(entity);
	if(window.Editor) { EDITOR.render(); }
    }

    RemoveChild(entity)
    {
	delete this.m_Entities[this.m_Entities.indexOf(entity)];
	this.m_Entities.splice(this.m_Entities.indexOf(entity), 1);
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
	    this.ProcessInboundCommsQueue();
	    this.m_Entities.forEach(e => e.Update());
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

Entity.FromFile = (json, parent, offset) =>
{
    let entity = new Entity(json.pos.x + offset.x, json.pos.y + offset.y, json.pos.z + offset.z);
    try
    {
	parent.AddChild(entity);
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
	    entity.AddComponent(Component.FromFile(c));
	});
	json.entities.forEach(c => Entity.FromFile(c, entity, offset));
	if(window.Editor) { EDITOR.render(); }
	return entity;
    }
};
















