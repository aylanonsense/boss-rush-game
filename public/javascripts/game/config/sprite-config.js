if (typeof define !== 'function') { var define = require('amdefine')(module); }
define({
	PLAYER: {
		imagePath: '/image/player.gif',
		width: 24,
		height: 24,
		scale: 2,
		flip: true,
		loadingColor: '#1dc02c',
		replacements: { '#0b85ff': '#ff1515', '#195899': '#770300' }
	},
	GREEK_DIRT: {
		imagePath: '/image/tile/greek_dirt.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#e4bb6a'
	},
	GREEK_GRASS: {
		imagePath: '/image/tile/greek_grass.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#00b386'
	},
	GREEK_DARK_DIRT: {
		imagePath: '/image/tile/greek_dark_dirt.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#bd8753'
	},
	GREEK_DARK_GRASS: {
		imagePath: '/image/tile/greek_dark_grass.gif',
		width: 16,
		height: 16,
		scale: 2,
		flip: false,
		loadingColor: '#00b386'
	}
});
//SILVER star status!