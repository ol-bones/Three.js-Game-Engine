"use strict";

// Dependencies
// @Engine@
// @World@
// @Entity@
// @Component@

let EntityTreeView = (Main) => class extends Main
{
    constructor()
    {
	super();

	this.m_TreeViewElement = $("#EntityTreeViewView");
    }

    render()
    {
	this.m_TreeViewElement.empty();
	let ents_html = [];
	ENGINE.m_World.m_Entities.forEach(e =>
	{
	    ents_html.push(e.DataModel().ToHTML());
	});

	let tree_html = whiskers.render(WHTML["entity_tree_list_view_world_root"],
	{
	    WorldEntities: ents_html
	});

	this.m_TreeViewElement.append(tree_html);
    }
}
