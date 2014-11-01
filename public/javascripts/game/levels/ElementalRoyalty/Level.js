if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Level',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/levels/ElementalRoyalty/FrozenKing',
	'game/Player',
	'game/base/Widget',
	'game/base/TileGrid',
	'game/levels/ElementalRoyalty/map',
], function(
	Global,
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
		this.player = new Player(this, 300, 500);
		this.player.disableInput();
		this.playerHealthBar.setActor(this.player);
		this.playerHealthBar.hide();
		this.bossHealthBar.hide();
		this.backgroundTileGrid = new TileGrid(map.background.tiles,map.background.shapes,map.background.variants);
		this.tileGrid = new TileGrid(map.foreground.tiles,map.foreground.shapes,map.foreground.variants);
		this.obstacles = [];
		this._king = null;
		this.actors = [];
		this.widgets = [];
		this.effects = [];
		var self = this;
	}
	ElementalRoyalty.prototype = Object.create(SUPERCLASS.prototype);
	ElementalRoyalty.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		if(Global.SKIP_ANIMATIONS) {
			if(this._frame === 0) {
				this._king = this.spawnActor(new FrozenKing(this, 600, 500));
				this.playerHealthBar.show();
				this.bossHealthBar.show();
				this.bossHealthBar.setActor(this._king);
				this._king.ignoreCollisions = false;
				this._king.startFighting();
				this.player.enableInput();
			}
		}
		else if(this._frame === 30) { this.spawnActor(new IceBlock(this, 600, 192)); }
		else if(this._frame === 60) { this.spawnActor(new IceBlock(this, 600 + 32, 192)); }
		else if(this._frame === 90) { this.spawnActor(new IceBlock(this, 600, 192 - 32)); }
		else if(this._frame === 120) { this.spawnActor(new IceBlock(this, 600 + 32, 192 - 32)); }
		else if(this._frame === 230) { this._king = this.spawnActor(new FrozenKing(this, 600, -150)); }
		else if(this._frame === 280) { this._king.ignoreCollisions = false; }
		else if(this._frame === 380) { this._king.strikeIntroPose(); }
		else if(this._frame === 420) {
			this.playerHealthBar.show();
			this.bossHealthBar.show();
			this.bossHealthBar.setActor(this._king);
			this.bossHealthBar.fillFromEmpty();
		}
		else if(this._frame === 565) {
			this._king.startFighting();
			this.player.enableInput();
		}
	};

	return ElementalRoyalty;
});