// Dependencies
// @Component@
// @Entity@

class GRIDPlayerControlComponent extends mix(Component).with()
{
    constructor(args)
    {
	super(args);

	this.m_Name = "GRIDPlayerControlComponent";
    }

    Initialise()
    {
	super.Initialise();
    }

    Activate(entity)
    {
	if(!entity) { debugger; }
	console.log(entity.m_Components.PathFindingNodeComponent.m_NodeID, entity.m_Components.PathFindingNodeComponent.m_Neighbours.length > 0 ? entity.m_Components.PathFindingNodeComponent.m_Neighbours.filter(e => e ? e.m_Components.PathFindingNodeComponent : null).map(n => n.m_Components.PathFindingNodeComponent.m_NodeID) : []);

	var end = entity.m_Parent.m_Children[30];
	var start = entity;

	console.log("Target: ", end.m_Components.PathFindingNodeComponent.m_NodeID);

	var path = entity.m_Parent.Path(start, end);

	if(path.map((n)=>(n.m_Components===undefined)?-1:0).includes(-1))
	{
	    console.log("epic failure");
	    path.forEach((e) => {if(e.m_Components!==undefined) e.m_Components.RenderComponent.m_Mesh.material.color.set("#FF0000")});
	}
	else
	{
	    start.m_Components.RenderComponent.m_Mesh.material.color.b = 0;
	    end.m_Components.RenderComponent.m_Mesh.material.color.r = 0;
	    path.forEach((e) => e.m_Components.RenderComponent.m_Mesh.material.color.g = 0);
	    path[path.length-1].m_Components.RenderComponent.m_Mesh.material.color.set("#00FF00");
	    if(path[path.length-1].m_Components.PathFindingNodeComponent.m_NodeID === end.m_Components.PathFindingNodeComponent.m_NodeID) console.log("sucess");
	    else console.log("failure");
	}
    }

    Update()
    {
	super.Update();
    }
}
