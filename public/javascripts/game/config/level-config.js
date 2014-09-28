if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	entityLegend: {
		p: 'Player'
	},
	shapeLegend: {
		M: 'full',
		T: 'upper-half',
		L: 'lower-half'
	},
	spriteLegend: {
		D: 'DIRT-TILE'
	},
	levels: {
		'LEVEL 1': {
			shapes: [
				'       ',
				'LMMTMLM'
			], sprites: [
				'      ',
				'DDDDDDD'
			], frames: [
				'      ',
				'h00g0h0'
			]
		}
	}
});