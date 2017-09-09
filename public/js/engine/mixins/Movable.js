let Movable = (Entity) => class extends Entity
{
    constructor()
    {
	super();
	console.log("movable constructor();");
    }

    move()
    {
	console.log("moooove");
    }
}
