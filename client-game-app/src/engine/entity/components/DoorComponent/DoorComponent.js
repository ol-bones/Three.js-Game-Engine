"use strict";

import Entity from "./../../entities/Entity";
import Component from "./../Component";
import {mix} from "mixwith";

class DoorComponent extends mix(Component).with()
{
    constructor(args)
    {
        super(args);

        this.m_Debuggable = false;

        this.m_Name = "DoorComponent";

        this.m_IsLocked = false;
        this.m_IsOpen = false;
        this.m_IsClosed = false;
        
    }

    Initialise()
    {
        super.Initialise();
    }

    OnInitialised()
    {

		this.m_IsInitialised = true;
    }

    Remove()
    {
        
    }

    Update()
    {
	}
}

export default DoorComponent;