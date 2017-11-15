class EntityModel
{
    constructor(object)
    {
	this.ID = object.m_ID || -1;
	this.POS = {x:object.m_Position.x, y:object.m_Position.y, z:object.m_Position.z} || {};

	this.PARENT = object.m_Parent ? object.m_Parent.m_ID : -1;
	this.CHILDREN = object.m_Children.map(e => e.DataModel().ToJSON()) || [];
	this.COMPONENTS = Object.keys(object.m_Components).map(c =>
object.m_Components[c].DataModel().ToJSON()) || [];
    }

    ToJSON()
    {
	return {id: this.ID, pos: this.POS, parent: this.PARENT, children: this.CHILDREN, components: this.COMPONENTS};

    }
}
