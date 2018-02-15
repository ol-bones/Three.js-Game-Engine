"use strict";

class ComponentModel
{
    constructor(object)
    {
	this.ARGS = object.m_Args || [];
	if(object.m_Name === "RenderComponent"
	&& !object.m_Args.Scale)
	{
	    this.ARGS.Scale =
	    {
		"x": object.m_Parent.m_Scale.x,
		"y": object.m_Parent.m_Scale.y,
		"z": object.m_Parent.m_Scale.z
	    };
	}
	this.ARGS.Parent = this.ARGS.Parent ? this.ARGS.Parent.m_ID : object.m_Parent ?
object.m_Parent.m_ID : -1;
	this.NAME = object.constructor.name || "Component";
	this.UPDATEABLE = object.m_Updateable || false;
    }

    ToJSON()
    {
	return {args:this.ARGS, name:this.NAME, updateable:this.UPDATEABLE};
    }
}

