if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/hud/HealthBar'
], function(
	Global,
	HealthBar
) {
	function Level() {
		this._frame = -1;
		this.backgroundColor = '#222';
		this.player = null;
		this.backgroundTileGrid = null;
		this.tileGrid = null;
		this.obstacles = [];
		this.actors = [];
		this.widgets = [];
		this.effects = [];
		this.bossHealthBar = new HealthBar('boss', 618, 10);
		this.playerHealthBar = new HealthBar('player', 10, 10);
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
		return effect;
	};
	Level.prototype.spawnActor = function(actor) {
		actor._recalculateHitBoxes();
		actor._recalculateCollisionBoxes();
		this.actors.push(actor);
		return actor;
	};
	Level.prototype._cullDeadObjects = function() {
		this.actors = this.actors.filter(function(actor) {
			return actor.isAlive();
		});
		this.effects = this.effects.filter(function(effect) {
			return effect.isAlive();
		});
	};
	Level.prototype.renderHUD = function(ctx) {
		//draw black backdrop to HUD
		ctx.fillStyle = '#111';
		ctx.fillRect(0, 0, Global.WIDTH, 60);

		//draw HUD elements
		this.bossHealthBar.render(ctx);
		this.playerHealthBar.render(ctx);
	};
	return Level;
});