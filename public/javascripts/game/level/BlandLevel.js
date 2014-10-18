if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/actor/Bee',
	'game/detail/Widget',
	'game/tile/TileGrid',
	'game/obstacle/Log',
	'game/config/level-config'
], function(
	Bee,
	Widget,
	TileGrid,
	Log,
	levelConfig
) {
	function BlandLevel() {
		this.backgroundColor = '#222';
		this.player = new Bee(this);
		this.player.pos.x = 300;
		this.player.pos.y = 415;
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
		this.obstacles = [ new Log(600, 457) ];
		this.actors = [ new Bee(this) ];
		this.actors[0].pos.x = 400;
		this.actors[0].pos.y = 100;
		this.widgets = [
			new Widget('FLOWER', 100, 489, 1),
			new Widget('FLOWER', 410, 392, 1),
			new Widget('FLOWER', 500, 489, 0)
		];
		this.effects = [];
		//TODO level bounds (for camera [and actors])
	}
	BlandLevel.prototype.startOfFrame = function() {};
	BlandLevel.prototype.endOfFrame = function() {};
	return BlandLevel;
});