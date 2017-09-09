let Clickable = (Entity) => class extends Entity
{
    constructor()
    {
	super();
	console.log("clickable constructor();");
    }

    click()
    {
	console.log("click");
    }
}
