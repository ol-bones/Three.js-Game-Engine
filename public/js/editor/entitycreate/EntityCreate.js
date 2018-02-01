"use strict";

// Dependencies
// @Engine@

class EntityCreate
{
    constructor()
    {
	ENGINE.OnInitialised = () => this.Initialise();
    }

    Initialise()
    {
	EDITOR = this;

	let grid = new THREE.GridHelper(50,10);
	ENGINE.m_World.m_Scene.add(grid);
    }

    ImportModal()
    {
	$("#import-modal").modal();
    }
}
