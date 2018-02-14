"use strict";

// Dependencies
// @Engine@
// @World@
// @Entity@
// @Component@

// @EntityTreeView@

class Editor extends mix(BaseObject).with(
    EditToolsControl, MaterialToolsControl, EditNavBarControl,
    EntityTreeView, EntityPropertyManipulatorView, WorldLoader
)
{
    constructor()
    {
	super();

	this.m_UpdateIntervalID = null;

	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	EDITOR = this;
	let grid = new THREE.GridHelper(10000, 10);
	ENGINE.m_World.m_Scene.add(grid);
	this.LoadWorld();
    }

    DeleteEntity(id, evt)
    {
	if(evt)
	{
	    evt.srcElement.parentElement.parentElement.remove();
	    evt.cancelBubble = true;
	}
	entities().find(e => e.m_ID === id).Delete();
    }

    render()
    {
	super.render();
    }
}

window.Editor = {};
let EDITOR = window.Editor;
