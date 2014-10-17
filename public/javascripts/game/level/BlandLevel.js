if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/actor/Bee',
	'game/tile/TileGrid',
	'game/config/level-config'
], function(
	Bee,
	TileGrid,
	levelConfig
) {
	function BlandLevel() {
		this.backgroundColor = '#222';
		this.player = new Bee(this);
		this.backgroundTileGrid = new TileGrid(
			levelConfig.LEVEL_1.background.tiles,
			levelConfig.LEVEL_1.background.shapes,
			levelConfig.LEVEL_1.background.variants
		);
		this.tileGrid = new TileGrid(
			levelConfig.LEVEL_1.foreground.tiles,
			levelConfig.LEVEL_1.foreground.shapes,
			levelConfig.LEVEL_1.foreground.variants
		);
		this.obstacles = [];
		this.actors = [ new Bee(this) ];
		this.widgets = [];
		this.effects = [];
		//TODO level bounds (for camera [and actors])
	}
	BlandLevel.prototype.startOfFrame = function() {};
	BlandLevel.prototype.endOfFrame = function() {};
	return BlandLevel;
});