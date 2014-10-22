if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/base/Level',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/levels/ElementalRoyalty/FrozenKing',
	'game/Player',
	'game/base/Widget',
	'game/base/TileGrid',
	'game/levels/ElementalRoyalty/map',
], function(
	Level,
	IceBlock,
	FrozenKing,
	Player,
	Widget,
	TileGrid,
	map
) {
	var SUPERCLASS = Level;
	function ElementalRoyalty() {
		SUPERCLASS.call(this);
		this.backgroundColor = '#222';
		this.player = new Player(this, 300, 300);
		this.backgroundTileGrid = new TileGrid(map.background.tiles,map.background.shapes,map.background.variants);
		this.tileGrid = new TileGrid(map.foreground.tiles,map.foreground.shapes,map.foreground.variants);
		this.obstacles = [];
		this.actors = [ new FrozenKing(this, 600, 350) ];
		this.widgets = [];
		this.effects = [];
		var self = this;
		//TODO level bounds (for camera [and actors])
	}
	ElementalRoyalty.prototype = Object.create(SUPERCLASS.prototype);

	return ElementalRoyalty;
});