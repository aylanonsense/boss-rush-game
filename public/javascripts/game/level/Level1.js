if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/config/level-config',
	'game/tile/TileGrid'
], function(
	config,
	TileGrid
) {
	function Level1(player) {
		this.tileGrid = new TileGrid();
		this.tileGrid.loadFromMap(
			config.levels['LEVEL 1'].shapes,
			config.levels['LEVEL 1'].sprites,
			config.levels['LEVEL 1'].frames
		);
		player.pos.x = 50;
		player.pos.y = -100;
	}
	return Level1;
});