// Dependencies
// @Component@
// @Entity@

class WASDPlayerControlComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "WASDPlayerControlComponent";

	this.m_Ray = {};

	this.m_Keys =
	{
	    W: false,
	    A: false,
	    S: false,
	    D: false
	}

	console.log("WASD constructor();");
    }

    Initialise()
    {
	super.Initialise();

	this.m_Ray = new THREE.Raycaster();

	$('body').on('keydown', e =>
	{
	    e.preventDefault();

	    switch(e.keyCode)
	    {
		case 87:
		    this.m_Keys.W = true;
		    break;
		case 65:
		    this.m_Keys.A = true;
		    break;
		case 83:
		    this.m_Keys.S = true;
		    break;
		case 68:
		    this.m_Keys.D = true;
		    break;
		default:
		    break;
	    }
	});

	$('body').on('keyup', e =>
	{
	    e.preventDefault();

	    switch(e.keyCode)
	    {
		case 87:
		    this.m_Keys.W = false;
		    break;
		case 65:
		    this.m_Keys.A = false;
		    break;
		case 83:
		    this.m_Keys.S = false;
		    break;
		case 68:
		    this.m_Keys.D = false;
		    break;
		default:
		    break;
	    }
	});
	console.log("WASD initialise");
	this.m_Arrow = new THREE.ArrowHelper(new THREE.Vector3(0,0,0), new THREE.Vector3(0,1,0), 2.5, 0xFF0000);
	GAME.m_World.m_Scene.add(this.m_Arrow);
    }

    Update()
    {
	this.m_Ray.ray.origin.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
	this.m_Ray.ray.direction = new THREE.Vector3(0, -1, 0);

	this.m_Arrow.position.set(this.m_Ray.ray.origin.x, this.m_Ray.ray.origin.y, this.m_Ray.ray.origin.z);

	if(this.m_Keys.W) { this.m_Ray.ray.origin.z += 2.5; }
	if(this.m_Keys.S) { this.m_Ray.ray.origin.z -= 2.5; }
	if(this.m_Keys.A) { this.m_Ray.ray.origin.x += 2.5; }
	if(this.m_Keys.D) { this.m_Ray.ray.origin.x -= 2.5; }

	var intersects = this.m_Ray.intersectObjects(GAME.m_World.m_Entities.filter(e => e.m_Renderable).map(e => e.m_Components.RenderComponent.m_Mesh));//.filter(e => e === this.m_Parent));

	if(intersects.length > 0)
	{
	   if(this.m_Keys.W) { this.m_Parent.SetPositionZ(this.m_Parent.m_Position.z + 2.5); }
	   if(this.m_Keys.S) { this.m_Parent.SetPositionZ(this.m_Parent.m_Position.z - 2.5); }
	   if(this.m_Keys.A) { this.m_Parent.SetPositionX(this.m_Parent.m_Position.x + 2.5); }
	   if(this.m_Keys.D) { this.m_Parent.SetPositionX(this.m_Parent.m_Position.x - 2.5); }

	   let arrow_pos = new THREE.Vector3(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
	   this.m_Arrow.position.set(this.m_Parent.m_Position.x, this.m_Parent.m_Position.y, this.m_Parent.m_Position.z);
	   this.m_Arrow.setDirection((arrow_pos.sub(intersects[0].point)).normalize().multiplyScalar(-1));
	   this.m_Arrow.setLength(this.m_Arrow.position.distanceTo(intersects[0].point));
	   this.m_Parent.SetPositionY(intersects[0].point.y + 50);
	}
    }
}
