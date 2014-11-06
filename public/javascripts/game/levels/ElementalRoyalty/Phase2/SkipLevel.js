if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Level',
	'game/levels/ElementalRoyalty/Phase2/ScorchingQueen',
	'game/Player',
	'game/base/TileGrid',
	'game/levels/ElementalRoyalty/map',
], function(
	Global,
	Level,
	ScorchingQueen,
	Player,
	TileGrid,
	map
) {
	var SUPERCLASS = Level;
	function SkipLevel() {
		SUPERCLASS.call(this);
		this.backgroundColor = '#222';
		this.bounds = { center: { x : 400, y: 400 }, left: 100, right: 700 };
		this.player = new Player(this, 300, 500);
		this.playerHealthBar.setActor(this.player);
		this.backgroundTileGrid = new TileGrid(map.background.tiles, map.background.shapes, map.background.variants);
		this.tileGrid = new TileGrid(map.foreground.tiles,map.foreground.shapes,map.foreground.variants);
		this.obstacles = [];
		this._queen = new ScorchingQueen(this, 600, 400);
		this.actors = [ this._queen ];
		this.widgets = [];
		this.effects = [];
		this.bossHealthBar.setActor(this._queen);
	}
	SkipLevel.prototype = Object.create(SUPERCLASS.prototype);

	return SkipLevel;
});