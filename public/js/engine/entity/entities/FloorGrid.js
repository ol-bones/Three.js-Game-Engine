"use strict";

// Dependencies
// @Entity@
// @BasicBoxMeshRenderComponent@

class FloorGrid extends Entity
{
    constructor(x,y,z)
    {
	super(x,y,z);
    }

    Initialise()
    {
	super.Initialise();

	let count = 0;
	for(let f = 0; f < 40; f++)
	{
	    for(let i = 0; i < 4; i++)
	    {
		let e = new Entity(this.m_Position.x + (i * 2.5) + (2.5/2),
				   this.m_Position.y,
				   this.m_Position.z - (2.5/2) - (f * 2.5));
		e.addComponent(new BasicBoxMeshRenderComponent(
		{
		    Parent: e,
		    Scale: new THREE.Vector3(2.5, 0.25 ,2.5)
		}));

		e.addComponent(new PhysicsComponent({Parent: e}));
		e.addComponent(new PathFindingNodeComponent({Parent: e, NodeID: count}));
		e.addComponent(new DebugComponent({Parent: e}));

		e.m_ClickFunctions.push((e)=>{ENGINE.m_World.m_LocalPlayer.m_Components.GRIDPlayerControlComponent.Activate(e)});

		count++;
		e.Initialise();
		this.addChild(e);
	    }
	}

	this.m_Children
	    .filter(child => child.m_Components.PathFindingNodeComponent)
	    .map(entity => entity.m_Components.PathFindingNodeComponent)
	    .forEach(node =>
	    {
		if((node.m_NodeID+1)%4!==0) node.m_Neighbours.push(this.GetNodeByNodeID(node.m_NodeID + 1));
		if(node.m_NodeID%4!==0)	    node.m_Neighbours.push(this.GetNodeByNodeID(node.m_NodeID - 1));
		if(node.m_NodeID < 156)	    node.m_Neighbours.push(this.GetNodeByNodeID(node.m_NodeID + 4));
		if(node.m_NodeID > 3)	    node.m_Neighbours.push(this.GetNodeByNodeID(node.m_NodeID - 4));
	    });
    }

    Path(from, to)
    {
	let open = [from];

	from.m_Components.PathFindingNodeComponent.F(to);

	while(open.length > 0)
	{
	    let current = open.shift();
	    if(current === to) { break; }

	    current.m_Components.PathFindingNodeComponent.GetNeighbours()
		.filter((n) => !n.m_Components.PathFindingNodeComponent.m_Closed)
		.filter((n) => !n.m_Components.PathFindingNodeComponent.m_Visited || n.m_Components.PathFindingNodeComponent.TF(to,current) < n.m_Components.PathFindingNodeComponent.m_F)
		.forEach((n) =>
		{
		    n.m_Components.PathFindingNodeComponent.m_Visited = true;
		    n.m_Components.PathFindingNodeComponent.m_Previous = current;
		    n.m_Components.PathFindingNodeComponent.F(to);

		    open.push(n);
		});

	    current.m_Components.PathFindingNodeComponent.m_Closed = true;
	    open.sort((a,b) => a.m_Components.PathFindingNodeComponent.m_F - b.m_Components.PathFindingNodeComponent.m_F);
	}

	let path = [to];
	while(true)
	{
	    if(path[path.length-1] === from || path[path.length-1].m_Components === undefined) break;
	    path.push(path[path.length-1].m_Components.PathFindingNodeComponent.m_Previous);
	}
	console.log(path.map((n) => (n.m_Components===undefined)?-1:n.m_Components.PathFindingNodeComponent.m_NodeID));
	this.m_Children.forEach((n) => n.m_Components.PathFindingNodeComponent.Reset());
	return path.reverse();

    }

    GetNodeByNodeID(id) { return this.m_Children.find(n => n.m_Components.PathFindingNodeComponent.m_NodeID === id); }

    Update()
    {
	super.Update();
    }
}
