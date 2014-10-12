if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/config/level-config',
	'game/tile/TileGrid'
], function(
	config,
	TileGrid
) {
	function Level1(player) {
		this.tileGrid = new TileGrid(
			config.LEVEL_1.foreground.tiles,
			config.LEVEL_1.foreground.shapes,
			config.LEVEL_1.foreground.variants
		);
		this.backgroundTileGrid = new TileGrid(
			config.LEVEL_1.background.tiles,
			config.LEVEL_1.background.shapes,
			config.LEVEL_1.background.variants
		);
		this.playerStartPoint = { x: 350, y: 250 };
	}
	return Level1;
});