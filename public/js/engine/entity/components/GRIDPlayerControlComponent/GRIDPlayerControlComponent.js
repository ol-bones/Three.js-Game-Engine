"use strict";

// Dependencies
// @Component@
// @Entity@

class GRIDPlayerControlComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "GRIDPlayerControlComponent";

	this.m_Ray = {};

	this.m_IsCurrentlyMoving = false;
	this.m_MoveVectors = [];
	this.m_CurrentTargetNode = {};

	this.m_CurrentNode = {};
    }

    Initialise()
    {
	super.Initialise();

	this.m_Ray = new THREE.Raycaster();
	this.m_IsInitialised = true;
    }

    Activate(entity)
    {
	if(!entity) { debugger; }
	console.log(entity.m_Components.PathFindingNodeComponent.m_NodeID, entity.m_Components.PathFindingNodeComponent.m_Neighbours.length > 0 ? entity.m_Components.PathFindingNodeComponent.m_Neighbours.filter(e => e ? e.m_Components.PathFindingNodeComponent : null).map(n => n.m_Components.PathFindingNodeComponent.m_NodeID) : []);

	var end = entity;
	var start = this.m_CurrentNode.m_ID ? this.m_CurrentNode : this.GetPlayerNodeByRay();

	var path = entity.m_Parent.Path(start, end);

	start.m_Components.RenderComponent.m_Mesh.material.color.b = 0;
	end.m_Components.RenderComponent.m_Mesh.material.color.r = 0;
	path.forEach((e) => e.m_Components.RenderComponent.m_Mesh.material.color.g = 0);
	path[path.length-1].m_Components.RenderComponent.m_Mesh.material.color.set("#00FF00");

	this.Move(path);
    }

    GetPlayerNodeByRay()
    {
	let ply_position = this.m_Parent.m_Position;
	this.m_Ray.ray.origin.set(ply_position.x, ply_position.y, ply_position.z);
	this.m_Ray.ray.direction = new THREE.Vector3(0,-1,0);

	var intersects = this.m_Ray.intersectObjects(GAME.m_World.m_Entities.find((n) => n.Path).m_Children.map((e) => e.m_Components.RenderComponent.m_Mesh));

	if(intersects.length > 0)
	{
	    return intersects[0].object.m_ParentEntity;
	}

	return false;
    }

    Move(nodes)
    {
	if(this.m_IsCurrentlyMoving) return false;

	this.m_IsCurrentlyMoving = true;
	this.m_MoveVectors = [].concat(nodes);

	this.m_CurrentTargetNode = this.m_MoveVectors.shift();

    }

    Update()
    {
	super.Update();

	if(this.m_IsCurrentlyMoving)
	{
	    let ply_position = this.m_Parent.m_Position.clone();

	    let step = (ply_position.sub(this.m_CurrentTargetNode.m_Position)).normalize();
	    step.y = 0;
	    this.m_Parent.m_Position.sub(step.multiplyScalar(0.5));

	    if(this.m_Parent.m_Position.distanceTo(this.m_CurrentTargetNode.m_Position) <= 5.0025)
	    {
		if(this.m_MoveVectors.length > 0)
		{
		    this.m_CurrentTargetNode = this.m_MoveVectors.shift();
		}
		else
		{
		    this.m_IsCurrentlyMoving = false;
		    this.m_CurrentTargetNode = {};
		}
	    }
	}
    }
}












