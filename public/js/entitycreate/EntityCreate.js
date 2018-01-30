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
    }
}
