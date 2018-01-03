"use strict";

let Clickable = (Entity) => class extends Entity
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
}
