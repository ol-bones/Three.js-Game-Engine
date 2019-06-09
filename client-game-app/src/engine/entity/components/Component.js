"use strict";

import ComponentModel from "./../models/ComponentModel";

class Component
{
    constructor(args)
    {
        this.m_Args = args;

        this.m_Name = Component;
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

    Name() { return this.constructor.name; }

    Update()
    {
    }

    Remove()
    {

    }
}

export default Component;