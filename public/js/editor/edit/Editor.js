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
	this.LoadWorld();
    }

    render()
    {
	super.render();
    }
}

window.Editor = {};
let EDITOR = window.Editor;
