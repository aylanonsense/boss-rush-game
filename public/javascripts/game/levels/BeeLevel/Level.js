if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/levels/BeeLevel/Bee',
	'game/levels/BeeLevel/Log',
	'game/base/Widget',
	'game/base/TileGrid',
	'game/levels/BeeLevel/map',
], function(
	Bee,
	Log,
	Widget,
	TileGrid,
	map
) {
	function BeeLevel() {
		this.backgroundColor = '#222';
		this.player = new Bee(this);
		this.player.pos.x = 300;
		this.player.pos.y = 415;
		this.backgroundTileGrid = new TileGrid(map.background.tiles,map.background.shapes,map.background.variants);
		this.tileGrid = new TileGrid(map.foreground.tiles,map.foreground.shapes,map.foreground.variants);
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
	BeeLevel.prototype.startOfFrame = function() {};
	BeeLevel.prototype.endOfFrame = function() {};
	return BeeLevel;
});