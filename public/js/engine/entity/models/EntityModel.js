"use strict";

class EntityModel
{
    constructor(object)
    {
	this._object = object;

	this.ID = object.m_ID || -1;
	this.POS = {x:object.m_Position.x, y:object.m_Position.y, z:object.m_Position.z} || {};

	this.PARENT = object.m_Parent ? object.m_Parent.m_ID : -1;
	this.ENTITIES = object.m_Entities.map(e => e.DataModel().ToJSON()) || [];
	this.COMPONENTS = Object.keys(object.m_Components).map(c =>
object.m_Components[c].DataModel().ToJSON()) || [];
    }

    ToJSON()
    {
	return {id: this.ID, pos: this.POS, parent: this.PARENT, entities: this.ENTITIES, components: this.COMPONENTS};

    }

    ToHTML()
    {
	let EntityString = "Entity[" + this.ID + "]";

	if(this.ENTITIES.length > 0)
	{
	    let entities_html = "";
	    this._object.m_Entities.forEach(e => { entities_html += (e.DataModel().ToHTML()); });
	    let w = whiskers.render(WHTML["entity_tree_list_view"],
	    {
		EntityHasChildren: true,
		EntityString: EntityString,
		EntityID: this.ID,
		EntityChildren: entities_html
	    });
	    return w;
	}
	else
	{
	    return whiskers.render(WHTML["entity_tree_list_view"],
	    {
		EntityHasChildren: false,
		EntityString: EntityString,
		EntityID: this.ID,
		EntityChildren: ""
	    });
	}
    }
}
