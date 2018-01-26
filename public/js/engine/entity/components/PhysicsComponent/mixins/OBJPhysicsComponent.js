"use strict";

// Dependencies
// @Component@
// @PhysicsComponent@
// @Entity@

class OBJPhysicsComponent extends mix(PhysicsComponent).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "PhysicsComponent";

	this.m_Force = new CANNON.Vec3(0,0,0);

	this.m_PhysicsBody = {};
	this.m_BodySettings = args.BodySettings || {};
    }

    Initialise()
    {
	let phys_model = json(this.m_Args.model.replace(".obj", "_phys.json"));
	console.log(phys_model);

	let kvp = Object.keys(phys_model)
	    .map(key => [key, phys_model[key]]);

	this.m_PhysicsBody = new CANNON.Body({mass: 50});
	kvp.forEach(physics_submodel =>
	{
	    let phys_name = physics_submodel[0];
	    let phys_data = physics_submodel[1];
	    if(phys_data.type === 1)
	    {
		this.m_PhysicsBody.addShape(
		    new CANNON.Box(new CANNON.Vec3(
			...Object.keys(phys_data.scale).map(
			    dir => phys_data.scale[dir])
		    )),
		    new CANNON.Vec3(
			...Object.keys(phys_data.pos).map(
			    dir => phys_data.pos[dir])
		    )
		);
		if(phys_data.rot)
		{
		    this.m_PhysicsBody.shapeOrientations[
			this.m_PhysicsBody.shapeOrientations.length-1
		    ].setFromAxisAngle(
			new CANNON.Vec3(
			    ...Object.keys(phys_data.rot.axis).map(
				axis => phys_data.rot.axis[axis]
			    )
			),
			phys_data.rot.r
		    );
		}
	    }
	});

	super.Initialise();
    }
}
