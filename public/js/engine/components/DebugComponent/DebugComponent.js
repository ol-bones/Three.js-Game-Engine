// Dependencies
// @Component@
// @Entity@
// @RenderComponent@
class DebugComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "DebugComponent";

	this.m_Axis = {};
	this.m_Mesh = {};
    }

    Initialise()
    {
	super.Initialise();

	if(this.m_Parent.m_Components.PhysicsComponent)
	{
	    let phys_geom = {};
	    switch(this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.type)
	    {
		case "cylinder": phys_geom = new THREE.CylinderGeometry(
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[0],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[2],
		    this.m_Parent.m_Components.PhysicsComponent.m_BodySettings.size[1], 10, 10
		);
	    }

	    let material = new THREE.LineBasicMaterial({
		color: 0xff0000,
		linewidth: 1,
		linecap: 'round',
		linejoin:  'round'
	    });

	    this.m_Mesh = new THREE.LineSegments(phys_geom, material);
	    this.m_Mesh.renderOrder = 999;
	    this.m_Mesh.onBeforeRender = function( renderer ) { renderer.clearDepth(); };

	}

	this.m_Axis = new THREE.AxisHelper(5);
	GAME.m_World.m_Scene.add(this.m_Axis);
	GAME.m_World.m_Scene.add(this.m_Mesh);
    }

    // Called by RenderComponent
    SetPosition(x,y,z)
    {
	if (this.m_Axis.position)
	{
	    this.m_Axis.position.set(x,y,z);
	}
	if(this.m_Mesh.position)
	{
	    this.m_Mesh.position.set(x,y,z);
	}
    }

    Update()
    {
    }
}
