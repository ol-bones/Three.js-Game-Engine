"use strict";

let LOADSTATE = {};

LOADSTATE.ERROR		= 0;

LOADSTATE.INACTIVE	= 1;
LOADSTATE.INITIALISING	= 2;
LOADSTATE.QUEUED	= 4;
LOADSTATE.INITIALISED	= 8;
LOADSTATE.DOWNLOADING	= 16;
LOADSTATE.COMPLETE      = 32;
LOADSTATE.PROCESS       = 64;
LOADSTATE.FINISHED	= 128;
LOADSTATE.CACHED	= 256;
LOADSTATE.DISPOSE	= 512;

export default LOADSTATE;