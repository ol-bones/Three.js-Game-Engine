"use strict";

// Dependencies
// @Component@
// @Entity@

class PathFindingNodeComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "PathFindingNodeComponent";

	this.m_NodeID = args.NodeID !== undefined ? args.NodeID : -1;
	this.m_Neighbours = [];
	this.m_Previous = {};
	this.m_Visited = false;
	this.m_Closed = false;

	this.t_G = 0;
	this.t_H = 0;
	this.t_F = 0;

	this.m_G = 0;
	this.m_H = 0;
	this.m_F = 0;
    }

    Reset()
    {
	this.m_Visited = false;
	this.m_Closed = false;
	this.m_Previous = {};
	this.m_G = 0;
	this.m_H = 0;
	this.m_F = 0;
	this.t_G = 0;
	this.t_H = 0;
	this.t_F = 0;
    }

    GetNeighbours()
    {
	return this.m_Neighbours;
    }

    TG(Node) { this.t_G = Node.m_G + 2.5; return this.t_G; }

    G()
    {
	this.m_G = (this.m_Previous.m_G || 0) + 2.5;
	return this.m_G;
    }

    H(Node)
    {
	this.m_H = this.m_Parent.m_Position.distanceTo(Node.m_Parent.m_Position);
	return this.m_H || 0;
    }

    TH(Node) { this.t_H = this.m_Parent.m_Position.distanceTo(Node.m_Parent.m_Position); return this.t_H; }
    F(Node) { this.m_F = (this.G()||0) + (this.H(Node)||0); return this.m_F; }
    TF(Goal, Node) { this.t_F = (this.TG(Node)||0) + (this.TH(Goal)||0); return this.t_F; }

    Initialise()
    {
	super.Initialise();
	this.m_IsInitialised = true;
    }

    Update()
    {
	super.Update();
    }
}
