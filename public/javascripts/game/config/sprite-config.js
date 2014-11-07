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
	SCORCHING_QUEEN: {
		imagePath: '/image/scorching_queen.gif',
		width: 32,
		height: 32,
		scale: 6,
		flip: true,
		crop: { x: 0, y: 0, width: 288, height: 96 },
		loadingColor: '#f00'
	},
	SCORCHING_SLASH: {
		imagePath: '/image/scorching_queen.gif',
		width: 50,
		height: 50,
		scale: 6,
		flip: true,
		crop: { x: 31, y: 198, width: 200, height: 200 },
		loadingColor: '#f00'
	},
	FIREBALL: {
		imagePath: '/image/scorching_queen.gif',
		width: 23,
		height: 23,
		scale: 6,
		flip: true,
		crop: { x: 0, y: 97, width: 138, height: 46 },
		loadingColor: '#f00'
	},
	ICE_BLOCK: {
		imagePath: '/image/elemental_royalty.gif',
		width: 10,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 65, y: 65, width: 30, height: 30 },
		loadingColor: '#4bf'
	},
	SNOWFLAKE: {
		imagePath: '/image/elemental_royalty.gif',
		width: 10,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 65, y: 95, width: 30, height: 30 },
		loadingColor: '#4bf'
	},
	ICE_CHIP: {
		imagePath: '/image/elemental_royalty.gif',
		width: 10,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 65, y: 95, width: 30, height: 10 },
		loadingColor: '#4bf'
	},
	ICE_SHARD: {
		imagePath: '/image/elemental_royalty.gif',
		width: 11,
		height: 11,
		scale: 4,
		flip: false,
		crop: { x: 175, y: 65, width: 44, height: 44 },
		loadingColor: '#4bf'
	},
	FROZEN_KING: {
		imagePath: '/image/elemental_royalty.gif',
		width: 32,
		height: 32,
		scale: 8,
		flip: true,
		loadingColor: '#4bf'
	},
	FROZEN_KING_DAMAGED: {
		imagePath: '/image/elemental_royalty.gif',
		width: 32,
		height: 32,
		scale: 8,
		flip: true,
		loadingColor: '#4bf',
		replacements: { '#4aa9ff': '#f66', '#0074fc': '#b00' }
	},
	FROZEN_KING_SCEPTER_SHINE: {
		imagePath: '/image/elemental_royalty.gif',
		width: 10,
		height: 10,
		scale: 8,
		flip: false,
		crop: { x: 95, y: 65, width: 20, height: 30 },
		loadingColor: '#4bf'
	},
	FROZEN_GROUND: {
		imagePath: '/image/elemental_royalty.gif',
		width: 10,
		height: 10,
		scale: 4,
		flip: false,
		crop: { x: 115, y: 65, width: 40, height: 30 },
		loadingColor: '#4bf'
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