if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/config/level-config',
	'game/tile/TileGrid'
], function(
	config,
	TileGrid
) {
	function Level1(player) {
		this.tileGrid = new TileGrid(config.LEVEL_1.tiles, config.LEVEL_1.shapes, config.LEVEL_1.variants);
		this.playerStartPoint = { x: 300, y: -100 };
	}
	return Level1;
});