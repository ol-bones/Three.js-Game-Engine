// Dependencies
// @Entity@

class WorldPiece extends mix(Entity).with()
{
    constructor(origin)
    {
	super(origin.x, origin.y, origin.z);
	this.m_PieceOrigin = origin;
    }

    Initialise()
    {
	super.Initialise();


	var k = new Entity(0,0,0);
	k.addComponent(new BasicShapeMeshRenderComponent({Parent: k}));
	k.Initialise();

	k.SetPosition(k.m_Position.x + this.m_PieceOrigin.x,
		      k.m_Position.y + this.m_PieceOrigin.y,
		      k.m_Position.z + this.m_PieceOrigin.z);

	var Points = [];
	    Points[0] = new THREE.Vector2(0, 0);
	    Points[1] = new THREE.Vector2(400, 0);
	    Points[2] = new THREE.Vector2(400, 400);
	    Points[3] = new THREE.Vector2(0, 400);

	var l = new Entity(400, 0, 400);
	l.addComponent(new BasicShapeMeshRenderComponent({Parent: l, Points: Points}));
	l.Initialise();

	l.SetPosition(l.m_Position.x + this.m_PieceOrigin.x,
		      l.m_Position.y + this.m_PieceOrigin.y,
		      l.m_Position.z + this.m_PieceOrigin.z);

	var Points2 = [];
	    Points2[0] = new THREE.Vector2(0, 0);
	    Points2[1] = new THREE.Vector2(50, 0);
	    Points2[2] = new THREE.Vector2(50, 100);
	    Points2[3] = new THREE.Vector2(0, 100);

	var o = new Entity(175, 0, 350);
	o.addComponent(new BasicShapeMeshRenderComponent({Parent: o, Points: Points2}));
	o.Initialise();

	o.SetPosition(o.m_Position.x + this.m_PieceOrigin.x,
		      o.m_Position.y + this.m_PieceOrigin.y,
		      o.m_Position.z + this.m_PieceOrigin.z);

	var u = new Entity(10, 50, 450);
	u.addComponent(new BasicHullMeshRenderComponent({Parent: u}));
	u.Initialise();

	u.SetPosition(u.m_Position.x + this.m_PieceOrigin.x,
		      u.m_Position.y + this.m_PieceOrigin.y,
		      u.m_Position.z + this.m_PieceOrigin.z);

	let boxes = [];
	for(let i = 0; i < 10; i++)
	{
	    boxes[i] = new Entity(i * 50, 200, 0);
	    boxes[i].addComponent(new BasicBoxMeshRenderComponent({Parent: boxes[i]}));
	    boxes[i].addComponent(new PhysicsComponent({Parent: boxes[i], Type:
CANNON.Body.DYNAMIC}));
	    boxes[i].addComponent(new DebugComponent({Parent: boxes[i]}));

	    boxes[i].onInitialised = (b) => {b.SetPosition(b.m_Position.x + this.m_PieceOrigin.x,
	    b.m_Position.y + this.m_PieceOrigin.y,
	    b.m_Position.z + this.m_PieceOrigin.z);};
	    boxes[i].Initialise();
	   }

	let ground = new Entity(0,0,0);
	ground.addComponent(new BasicBoxMeshRenderComponent({Parent: ground, Scale: {x:
1000, y: 5, z: 1000}}));
	ground.addComponent(new PhysicsComponent({Parent: ground, Type:
CANNON.Body.KINEMATIC}));
	ground.addComponent(new DebugComponent({Parent: ground}));
	ground.Initialise();

	ground.onInitialised = (b) => {b.SetPosition(b.m_Position.x + this.m_PieceOrigin.x,
	    b.m_Position.y + this.m_PieceOrigin.y,
	    b.m_Position.z + this.m_PieceOrigin.z);};
	var walls = [];
	walls[0] = new Entity(-150, 50, 10);
	walls[0].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[0],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-400, 0, 0),
	    new THREE.Vector3(-400, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 20),
	    new THREE.Vector3(0, 0, 20),
	    new THREE.Vector3(-400, 0, 20),
	    new THREE.Vector3(-400, 100, 20)
	    ]
	}));

	walls[1] = new Entity(-150, 50, -110);
	walls[1].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[1],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-400, 0, 0),
	    new THREE.Vector3(-400, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 20),
	    new THREE.Vector3(0, 0, 20),
	    new THREE.Vector3(-400, 0, 20),
	    new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[2] = new Entity(-360, 50, -50);
	walls[2].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[2],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, -100),
	    new THREE.Vector3(0, 0, -100),
	    new THREE.Vector3(-20, 100, -100),
	    new THREE.Vector3(-20, 0, -100)
	    ]
	}));


	walls[3] = new Entity(40, 50, 200);
	walls[3].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[3],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 400),
	    new THREE.Vector3(0, 0, 400),
	    new THREE.Vector3(-20, 100, 400),
	    new THREE.Vector3(-20, 0, 400)
	    ]
	}));


	walls[4] = new Entity(40, 50, -350);
	walls[4].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[4],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 500),
	    new THREE.Vector3(0, 0, 500),
	    new THREE.Vector3(-20, 100, 500),
	    new THREE.Vector3(-20, 0, 500)
	    ]
	}));

	walls[5] = new Entity(160, 50, -300);
	walls[5].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[5],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 600),
	    new THREE.Vector3(0, 0, 600),
	    new THREE.Vector3(-20, 100, 600),
	    new THREE.Vector3(-20, 0, 600)
	    ]
	}));


	walls[6] = new Entity(160, 50, 200);
	walls[6].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[6],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 200),
	    new THREE.Vector3(0, 0, 200),
	    new THREE.Vector3(-20, 100, 200),
	    new THREE.Vector3(-20, 0, 200)
	    ]
	}));


	walls[7] = new Entity(350, 50, 50);
	walls[7].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[7],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 100),
	    new THREE.Vector3(0, 0, 100),
	    new THREE.Vector3(-20, 100, 100),
	    new THREE.Vector3(-20, 0, 100)
	    ]
	}));


	walls[8] = new Entity(600, 50, 400);
	walls[8].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[8],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 400),
	    new THREE.Vector3(0, 0, 400),
	    new THREE.Vector3(-20, 100, 400),
	    new THREE.Vector3(-20, 0, 400)
	    ]
	}));


	walls[9] = new Entity(190, 50, 250);
	walls[9].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[9],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 100),
	    new THREE.Vector3(0, 0, 100),
	    new THREE.Vector3(-20, 100, 100),
	    new THREE.Vector3(-20, 0, 100)
	    ]
	}));


	walls[10] = new Entity(190, 50, 500);
	walls[10].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[10],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-20, 0, 0),
	    new THREE.Vector3(-20, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 200),
	    new THREE.Vector3(0, 0, 200),
	    new THREE.Vector3(-20, 100, 200),
	    new THREE.Vector3(-20, 0, 200)
	    ]
	}));

	walls[11] = new Entity(400, 50, 610);
	walls[11].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[11],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[12] = new Entity(400, 50, 190);
	walls[12].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[12],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-400, 0, 0),
		new THREE.Vector3(-400, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-400, 0, 20),
		new THREE.Vector3(-400, 100, 20)
	    ]
	}));


	walls[13] = new Entity(250, 50, 101);
	walls[13].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[13],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-200, 0, 0),
		new THREE.Vector3(-200, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-200, 0, 20),
		new THREE.Vector3(-200, 100, 20)
	    ]
	}));


	walls[14] = new Entity(250, 50, -10);
	walls[14].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[14],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-200, 0, 0),
		new THREE.Vector3(-200, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-200, 0, 20),
		new THREE.Vector3(-200, 100, 20)
	    ]
	}));

	walls[15] = new Entity(100, 50, -610);
	walls[15].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[15],
	    Points:
	    [
	    new THREE.Vector3(0, 0, 0),
	    new THREE.Vector3(-100, 0, 0),
	    new THREE.Vector3(-100, 100, 0),
	    new THREE.Vector3(0, 100, 0),
	    new THREE.Vector3(0, 100, 20),
	    new THREE.Vector3(0, 0, 20),
	    new THREE.Vector3(-100, 0, 20),
	    new THREE.Vector3(-100, 100, 20)
	    ]
	}));

	walls[16] = new Entity(100, 50, -300);
	walls[16].addComponent(new MaterialComponent({Parent: walls[16], texture: "swirl.jpg"}));
	walls[16].addComponent(new BasicHullMeshRenderComponent(
	{
	    Parent: walls[16],
	    Points:
	    [
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-100, 0, 0),
		new THREE.Vector3(-100, 100, 0),
		new THREE.Vector3(0, 100, 0),
		new THREE.Vector3(0, 100, 20),
		new THREE.Vector3(0, 0, 20),
		new THREE.Vector3(-100, 0, 20),
		new THREE.Vector3(-100, 100, 20)
	    ]
	}));

	walls[16].addComponent(new TriggerComponent({Parent: walls[16]}));

	walls.forEach(wall =>
	{
	    wall.addComponent(new PhysicsComponent({Parent: wall, Type: CANNON.Body.KINEMATIC}));
	    wall.addComponent(new DebugComponent({Parent: wall}));
	    wall.onInitialised = (b) => {;b.SetPosition(b.m_Position.x + this.m_PieceOrigin.x,
	    b.m_Position.y + this.m_PieceOrigin.y,
	    b.m_Position.z + this.m_PieceOrigin.z);};
	    wall.Initialise();
	});
    }

    SaveToJSON()
    {
	let json = [];
	this.m_Entities.forEach(e => json.push(e.GetSavableData()));
	console.log(json);
    }

    Update()
    {
	super.Update();
    }
}
