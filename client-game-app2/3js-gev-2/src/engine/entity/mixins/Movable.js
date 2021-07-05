"use strict";

import {mix, Mixin} from "mixwith";
let Movable = Mixin((superclass) => class extends superclass
{
    constructor()
    {
		super();
    }

    move()
    {
    }
});

export default Movable;