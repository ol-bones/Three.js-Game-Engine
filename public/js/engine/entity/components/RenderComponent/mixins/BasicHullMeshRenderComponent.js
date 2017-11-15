// Dependencies
// @RenderComponent@

class BasicHullMeshRenderComponent extends mix(RenderComponent).with()
{
    constructor(args)
    {
	super(args);

	var points = [];

	points[0] = new THREE.Vector3(0, 0, 0);
	points[1] = new THREE.Vector3(100, 0, 0);
	points[2] = new THREE.Vector3(100, 100, 0);
	points[3] = new THREE.Vector3(0, 100, 0);
	points[4] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);
	points[5] = new THREE.Vector3(Math.random()*100, 0, 100);
	points[6] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);
	points[7] = new THREE.Vector3(Math.random()*100, Math.random()*100, 100);

	this.m_Points = args.Points || points;
	this.m_Points = this.m_Points.map(p => {return p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z);});
    }

    Initialise()
    {
	super.Initialise();
	var geometry = new THREE.ConvexBufferGeometry(this.m_Points);
	geometry.center();

	var mesh = new THREE.Mesh(geometry,
this.m_Parent.m_Components.MaterialComponent.m_Material);

	this.m_Mesh = mesh;
	this.onInitialised();
    }

    Update()
    {
    }
}
