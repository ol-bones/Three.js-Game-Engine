let Clickable = (Entity) => class extends Entity
{
    constructor()
    {
	super();

	this.m_IsClickable = true;

	console.log("clickable constructor();");
    }

    Click()
    {
	console.log("click");
    }
}
