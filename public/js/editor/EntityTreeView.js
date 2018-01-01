// Dependencies
// @Game@
// @World@
// @Entity@
// @Component@

class EntityTreeView
{
    constructor()
    {
	this.m_TreeViewElement = $("#EntityTreeViewView");
    }

    render()
    {
	this.m_TreeViewElement.empty();
	let ents = [];
	GAME.m_World.m_Entities.forEach(e =>
	{
	    ents.push(e.DataModel().ToHTML());
	});

	this.m_TreeViewElement.append(ents);
    }
}
