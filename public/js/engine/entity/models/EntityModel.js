"use strict";

class EntityModel
{
    constructor(object)
    {
	this._object = object;

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

    ToHTML()
    {
	let html_for = "Entity[" + this.ID + "]";

	if(this.CHILDREN.length > 0)
	{
	    let children_html = "";
	    this._object.m_Children.forEach(e => { children_html += (e.DataModel().ToHTML()); });

	    return "<li class=\"file\"><label stlye=\"padding-left:0!important;\"for=\"" + html_for + "\">"
		    + html_for + "</label><input onclick=\"EDITOR.SelectEntity(" + this.ID
		    + ");\" type=\"checkbox\" id=\"" + html_for + "\"/><ol>"
		    + children_html + "</ol></li>";
	}
	else
	{
	    return "<li class=\""
		    + "file" + "\"><span onclick=\"EDITOR.SelectEntity("+this.ID+");\">" + html_for + "</span></li>";
	}
    }
}
