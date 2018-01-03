"use strict";

// Dependencies
// @Component@
// @Entity@

class TriggerComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "TriggerComponent";
    }

    Initialise()
    {
	super.Initialise();

	this.m_IsHolographic = true;

	this.m_IsInitialised = true;
    }

    OnTrigger(evt)
    {
	evt.body.m_ParentEntity.SetPosition(50, 100, -50);
    }

    Update()
    {
    }
}
