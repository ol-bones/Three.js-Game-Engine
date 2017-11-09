class ComponentModel
{
    constructor(object)
    {
	this.ARGS = object.m_Args || [];
	this.ARGS.Parent = this.ARGS.Parent ? this.ARGS.Parent.m_ID : -1;
	this.NAME = object.m_Name || "Component";
	this.PARENT = object.m_Parent ? object.m_Parent.m_ID : -1;
	this.UPDATEABLE = object.m_Updateable || false;
    }

    ToJSON()
    {
	return {args:this.ARGS, name:this.NAME, parent:this.PARENT, updateable:this.UPDATEABLE};
    }
}
