if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	entityLegend: {
		p: 'Player'
	},
	shapeLegend: {
		M: 'full',
		T: 'upper-half',
		L: 'lower-half',
		V: 'triangle-lower-left'
	},
	spriteLegend: {
		D: 'DIRT-TILE'
	},
	levels: {
		'LEVEL 1': {
			shapes: [
				'M',
				'M',
				'MMMV',
				'    V',
				'     V',
				'      V',
				'       V                M',
				'        LMMTMLMML     LMM',
				'                MML LMM',
				'                 MMMM'
			], sprites: [
				'D',
				'D',
				'DDDD',
				'    D',
				'     D',
				'      D',
				'       D                D',
				'        DDDDDDDDD     DDD',
				'                DDD DDD',
				'                 DDDD'
			], frames: [
				'0',
				'0',
				'000n',
				'    n',
				'     n',
				'      n',
				'       n                0',
				'        h00g0h00h     h00',
				'                00h h00',
				'                 0000'
			]
		}
	}
});