"use strict";

// Dependencies
// @Engine@
// @World@
// @Entity@
// @Component@

// @EntityTreeView@

class Editor extends mix(BaseObject).with(
    EditToolsControl, MaterialToolsControl, EditNavBarControl,
    WorldLoader
)
{
    constructor()
    {
	super();

	this.m_UpdateIntervalID = null;

	this.m_EntityTreeViewView = new EntityTreeView();
	this.m_EntityManipulator = new EntityPropertyManipulatorView();

	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	EDITOR = this;
	this.LoadWorld();
    }

    render()
    {
	this.m_EntityTreeViewView.render();
    }
}

window.Editor = {};
let EDITOR = window.Editor;
