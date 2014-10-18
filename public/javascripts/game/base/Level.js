if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/base/Widget',
	'game/base/TileGrid'
], function(
	Widget,
	TileGrid
) {
	function Level() {
		this._frame = 0;
		this.backgroundColor = '#222';
		this.player = null;
		this.backgroundTileGrid = null;
		this.tileGrid = null;
		this.obstacles = [];
		this.actors = [];
		this.widgets = [];
		this.effects = [];
	}
	Level.prototype.startOfFrame = function() {
		this._frame++;
		if(this._frame % 10 === 0) {
			this._cullDeadObjects();
		}
	};
	Level.prototype.endOfFrame = function() {
		//to be implemented by subclasses
	};
	Level.prototype.spawnEffect = function(effect) {
		this.effects.push(effect);
	};
	Level.prototype._cullDeadObjects = function() {
		this.actors = this.actors.filter(function(actor) {
			return actor.isAlive();
		});
		this.effects = this.effects.filter(function(effect) {
			return effect.isAlive();
		});
	};
	return Level;
});