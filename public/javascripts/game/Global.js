/* istanbul ignore if  */ if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	DEBUG_MODE: false,
	DEV_MODE: false,
	SKIP_ANIMATIONS: false,
	DEBUG_FRAMERATE: null, //only use for debug purposes, set to null
	WIDTH: 400,
	HEIGHT: 300,
	TILE_SIZE: 32
});