if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/base/Level',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/levels/BeeLevel/Bee',
	'game/levels/BeeLevel/Log',
	'game/base/Widget',
	'game/base/TileGrid',
	'game/levels/BeeLevel/map',
], function(
	Level,
	IceBlock,
	Bee,
	Log,
	Widget,
	TileGrid,
	map
) {
	var SUPERCLASS = Level;
	function ElementalRoyalty() {
		SUPERCLASS.call(this);
		this.backgroundColor = '#222';
		this.player = new Bee(this, 300, 415);
		this.player.pos.x = 300;
		this.player.pos.y = 415;
		this.backgroundTileGrid = new TileGrid(map.background.tiles,map.background.shapes,map.background.variants);
		this.tileGrid = new TileGrid(map.foreground.tiles,map.foreground.shapes,map.foreground.variants);
		this.obstacles = [ new Log(600, 457) ];
		this.actors = [ new Bee(this, 400, 100) ];
		this.widgets = [
			new Widget(100, 489, 'FLOWER', 1),
			new Widget(410, 392, 'FLOWER', 1),
			new Widget(500, 489, 'FLOWER', 0)
		];
		this.effects = [];
		var self = this;
		setInterval(function() {
			self.actors.push(new IceBlock(self, Math.floor((40 + Math.random() * 720) / 40) * 40, 100));
		}, 500);
		//TODO level bounds (for camera [and actors])
	}
	ElementalRoyalty.prototype = Object.create(SUPERCLASS.prototype);

	return ElementalRoyalty;
});