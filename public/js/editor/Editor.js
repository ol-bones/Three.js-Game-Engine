// Dependencies
// @Game@
// @World@
// @Entity@
// @Component@

// @EntityTreeView@

class Editor
{
    constructor()
    {
	console.log("lmao");
	this.m_EntityTreeViewView = new EntityTreeView();
	this.m_EntityManipulator = new EntityPropertyManipulatorView();
    }

    render()
    {
	this.m_EntityTreeViewView.render();
    }

    SelectEntity(id)
    {
	let entity = entities().find(e => e.m_ID === id);
	if(entity)
	{
	    this.m_EntityManipulator.onEntitySelect(entity.GetSavableData());
	}
    }
}

window.Editor = {};
let EDITOR = window.Editor;

$(document).ready(() =>
{
    EDITOR = new Editor();
});
