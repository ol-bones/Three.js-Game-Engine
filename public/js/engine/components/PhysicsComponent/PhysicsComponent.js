// Dependencies
// @Component@
// @Entity@

class PhysicsComponent extends mix(Component).with()
{

    constructor(args)
    {
	super(args);

	this.m_Name = "PhysicsComponent";

	this.m_PhysicsBody = {};
	this.m_BodySettings = args.BodySettings || {};
   }

    Initialise()
    {
	super.Initialise();

	this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.computeBoundingBox();
	this.m_BodySettings = this.m_BodySettings.type ? this.m_BodySettings :
	{
	    type:'box',
	    size:
	    [
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.x -
this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.x),
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.y -
this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.y),
		Math.abs(this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.min.z -
this.m_Parent.m_Components.RenderComponent.m_Mesh.geometry.boundingBox.max.z)
	    ],
	    pos:[this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z],
	    move:true
	};

	this.m_BodySettings.world = GAME.m_World.m_PhysicsWorld;

	this.m_PhysicsShape = new CANNON.Box(new CANNON.Vec3(this.m_BodySettings.size[0]/2,
							    this.m_BodySettings.size[1]/2,
							    this.m_BodySettings.size[2]/2));
	this.m_PhysicsBody = new CANNON.Body({ mass: 10, type: this.m_Args.Type });
	this.m_PhysicsBody.addShape(this.m_PhysicsShape);
	this.m_PhysicsBody.position.set(this.m_BodySettings.pos[0], this.m_BodySettings.pos[1],
this.m_BodySettings.pos[2]);

	if(this.m_Args.Type === CANNON.Body.DYNAMIC)
	{
	    this.m_PhysicsBody.addEventListener("collide", c => console.log(c));
	}

	this.m_BodySettings.world.add(this.m_PhysicsBody);

    }

    Update()
    {
	let body_pos = new THREE.Vector3(this.m_PhysicsBody.position.x,
this.m_PhysicsBody.position.y, this.m_PhysicsBody.position.z);
	this.m_Parent._SetPosition(body_pos.x, body_pos.y, body_pos.z);
    }
}
