"use strict";

// Dependencies
// @Component@
// @Entity@

class MinigolfClientBallControlComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Canvas = $("canvas")[0];
	this.m_Canvas.addEventListener("click", this.MouseClick.bind(this), false);
	$(this.m_Canvas).on("tap", this.MouseClick.bind(this));
	this.m_Dir = null;
	this.m_Name = "MinigolfClientBallControlComponent";
    }

    Initialise()
    {
	super.Initialise();

	this.OnInitialised();
    }

    OnInitialised()
    {
	this.m_Arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,0), 15, 0x000000, 0);
	//ENGINE.m_World.m_Scene.add(this.m_Arrow);
	this.m_IsInitialised = true;
    }

    MouseClick()
    {
	this.m_Parent.m_Components.PhysicsComponent.ApplyForce(
	    this.m_Dir.x*10000, this.m_Dir.y*10000, this.m_Dir.z*10000
	);
    }

    Update()
    {
	let m = ENGINE.m_Mouse.m_WorldPosition.clone();
	m.y = this.m_Parent.m_Position.y;
	this.m_Dir = m.sub(this.m_Parent.m_Position).normalize();
	this.m_Arrow.setDirection(this.m_Dir);
	this.m_Arrow.position.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
    }
}
