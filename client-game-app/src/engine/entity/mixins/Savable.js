"use strict";

import {mix, Mixin} from "mixwith";

let Savable = Mixin((superclass) => class extends superclass
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
});

export default Savable;
