"use strict";

import {mix, Mixin} from "mixwith";
let Clickable = Mixin((superclass) => class extends superclass
{
    constructor()
    {
		super();

		this.m_IsClickable = true;
		this.m_ClickFunctions = [];
    }

    Click()
    {
		if(this.m_ClickFunctions && this.m_ClickFunctions[0])
		{
			this.m_ClickFunctions[0](this);
		}
    }
});

export default Clickable;