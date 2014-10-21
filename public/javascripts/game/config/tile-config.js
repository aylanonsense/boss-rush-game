if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	GREEK_LIGHT_DIRT: {
		symbol: '4',
		sprite: 'GREEK_LIGHT_DIRT',
		variants: 3
	},
	GREEK_LIGHT_GRASS: {
		symbol: '1',
		sprite: 'GREEK_LIGHT_GRASS',
		variants: 3
	},
	GREEK_DARK_DIRT: {
		symbol: '2',
		sprite: 'GREEK_DARK_DIRT',
		variants: 3,
		background: true
	},
	GREEK_DARK_GRASS: {
		symbol: '3',
		sprite: 'GREEK_DARK_GRASS',
		variants: 3,
		oneWayPlatform: true
	},
	DUNGEON: {
		symbol: '0',
		sprite: 'DUNGEON_TILE',
		variants: 1
	}
});