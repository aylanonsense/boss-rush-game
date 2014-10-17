if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	PLAYER: {
		imagePath: '/image/player.gif',
		width: 24,
		height: 24,
		scale: 2,
		flip: true,
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
	},
	FROZEN_KING: {
		imagePath: '/image/frozen_king.gif',
		width: 32,
		height: 32,
		scale: 8,
		flip: true,
		loadingColor: '#00f'
	}
});
//SILVER star status!