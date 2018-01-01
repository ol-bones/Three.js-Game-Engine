"use strict";


let Savable = (Entity) => class extends Entity
{
    constructor()
    {
	super();

	this.m_IsSavable = true;
    }

    GetSavableData()
    {
	return this.DataModel().ToJSON();
    }
}
