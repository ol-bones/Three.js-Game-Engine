"use strict";

// Dependencies

class Component
{
    constructor(args)
    {
	this.m_Args = args;

	this.m_Name = "Component";
	this.m_Parent = args.Parent || null;
	this.m_Updateable = args.Updateable || false;

	this.m_IsInitialised = false;
    }

    LoadAssets()
    {

    }

    Initialise()
    {
    }

    OnInitialised()
    {
	this.m_IsInitialised = true;
    }

    DataModel() { return new ComponentModel(this); }

    Update()
    {
    }

    Remove()
    {

    }
}

Component.Types = [];

Component._TypeFromName = (json) => Component.Types.find(t => t.name === json.name);
Component.FromFile = (json) => new (Component._TypeFromName(json))(json.args);
