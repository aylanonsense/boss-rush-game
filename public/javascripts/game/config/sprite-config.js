if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	HUD_HEALTH_BAR: {
		imagePath: '/image/hud.gif',
		width: 43,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 0, y: 62, width: 43, height: 20 },
		loadingColor: '#fff'
	},
	HUD_HEALTH_PIP: {
		imagePath: '/image/hud.gif',
		width: 2,
		height: 5,
		scale: 4,
		flip: false,
		crop: { x: 0, y: 82, width: 4, height: 10 },
		loadingColor: '#fff'
	},
	ICE_BLOCK: {
		imagePath: '/image/elemental_royalty.gif',
		width: 20,
		height: 20,
		scale: 2,
		flip: false,
		crop: { x: 130, y: 130, width: 60, height: 60 },
		loadingColor: '#4bf'
	},
	SNOWFLAKE: {
		imagePath: '/image/elemental_royalty.gif',
		width: 20,
		height: 20,
		scale: 2,
		flip: false,
		crop: { x: 130, y: 190, width: 60, height: 60 },
		loadingColor: '#4bf'
	},
	ICE_SHARD: {
		imagePath: '/image/elemental_royalty.gif',
		width: 20,
		height: 20,
		scale: 2,
		flip: false,
		crop: { x: 150, y: 230, width: 80, height: 20 },
		loadingColor: '#4bf'
	},
	FROZEN_KING: {
		imagePath: '/image/elemental_royalty.gif',
		width: 64,
		height: 64,
		scale: 4,
		flip: true,
		loadingColor: '#4bf'
	},
	FROZEN_KING_DAMAGED: {
		imagePath: '/image/elemental_royalty.gif',
		width: 64,
		height: 64,
		scale: 4,
		flip: true,
		loadingColor: '#4bf',
		replacements: { '#47c2ff': '#f66', '#0074fc': '#b00' }
	},
	PLAYER: {
		imagePath: '/image/player.gif',
		width: 24,
		height: 24,
		scale: 2,
		flip: true,
		loadingColor: '#0b85ff'
	},
	MAIL: {
		imagePath: '/image/player.gif',
		width: 8,
		height: 8,
		scale: 2,
		flip: true,
		crop: { x: 144, y: 96, width: 24, height: 24 },
		loadingColor: '#0b85ff'
	},
	BEE: {
		imagePath: '/image/flower_power.gif',
		width: 10,
		height: 8,
		scale: 4,
		flip: true,
		crop: { x: 39, y: 6, width: 30, height: 8 },
		loadingColor: '#fff200'
	},
	LOG: {
		imagePath: '/image/flower_power.gif',
		width: 29,
		height: 18,
		scale: 4,
		flip: false,
		crop: { x: 30, y: 21, width: 29, height: 18 },
		loadingColor: '#f7941d'
	},
	FLOWER: {
		imagePath: '/image/flower_power.gif',
		width: 11,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 0, y: 2, width: 33, height: 10 },
		loadingColor: '#fff200'
	},
	POLLEN: {
		imagePath: '/image/flower_power.gif',
		width: 6,
		height: 9,
		scale: 4,
		flip: false,
		crop: { x: 10, y: 19, width: 12, height: 18 },
		loadingColor: '#f7941d'
	},
	DUNGEON_TILE: {
		imagePath: '/image/8bit_tiles.gif',
		width: 10,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 0, y: 0, width: 40, height: 70 },
		loadingColor: '#4c4c4c'
	},
	GREEK_LIGHT_DIRT: {
		imagePath: '/image/tile/greek_light_dirt.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#e4bb6a'
	},
	GREEK_LIGHT_GRASS: {
		imagePath: '/image/tile/greek_light_grass.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#e4bb6a'
	},
	GREEK_DARK_DIRT: {
		imagePath: '/image/tile/greek_light_dirt.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#bd8753',
		replacements: { '#eacb8e': '#cc9763', '#e4bb6a': '#bd8753', '#cca666': '#b37f51' }
	},
	GREEK_DARK_GRASS: {
		imagePath: '/image/tile/greek_light_grass.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#bd8753',
		replacements: { '#eacb8e': '#cc9763', '#e4bb6a': '#bd8753', '#cca666': '#b37f51' }
	},
	GREEK_OBSTACLES: {
		imagePath: '/image/greek_obstacles.gif',
		width: 24,
		height: 60,
		scale: 2,
		flip: false,
		loadingColor: '#f1a597'
	}
});