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

	let body = this.m_Parent.m_Components.PhysicsComponent.m_PhysicsBody;

	body.collisionResponse = this.m_IsHolographic;
	body.addEventListener("collide", evt =>
	{
	    if(evt.body.m_ParentEntity.m_ID === this.m_Parent.m_ID) return;
	    this.OnTrigger(evt);
	});

	this.OnInitialised();
    }

    OnTrigger(evt)
    {
	evt.body.m_ParentEntity.SetPosition(50, 100, -50);
    }

    Update()
    {
    }
}
