if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/config/level-config',
	'game/config/obstacle-config',
	'game/obstacle/Obstacle',
	'game/tile/TileGrid'
], function(
	levelConfig,
	obstacleConfig,
	Obstacle,
	TileGrid
) {
	function Level1(player) {
		this.tileGrid = new TileGrid(
			levelConfig.LEVEL_1.foreground.tiles,
			levelConfig.LEVEL_1.foreground.shapes,
			levelConfig.LEVEL_1.foreground.variants
		);
		this.backgroundTileGrid = new TileGrid(
			levelConfig.LEVEL_1.background.tiles,
			levelConfig.LEVEL_1.background.shapes,
			levelConfig.LEVEL_1.background.variants
		);
		this.playerStartPoint = { x: 100, y: 540 };
		this.obstacles = [];
	}
	return Level1;
});