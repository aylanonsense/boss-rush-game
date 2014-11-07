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
		this.bounds.width = this.bounds.right - this.bounds.left;
		this.bounds.height = this.bounds.bottom - this.bounds.top;
		this.bounds.center = { x: this.bounds.left + this.bounds.width / 2, y : this.bounds.top + this.bounds.height / 2 };
		this.backgroundColor = '#222';
		this.player = null;
		this.backgroundTileGrid = null;
		this.tileGrid = null;
		this.obstacles = [];
		this.actors = [];
		this.widgets = [];
		this.effects = [];
		this.timeScale = 1.0;
		this.bossHealthBar = new HealthBar('boss', 618, 10);
		this.playerHealthBar = new HealthBar('player', 10, 10);
		this._playerIsDying = false;
		this._isEndingLevel = false;
		this._framesToLevelEnd = 0;
		this.hasEnded = false;
	}
	Level.prototype.startOfFrame = function() {
		this._frame++;
		if(this._isEndingLevel) {
			this._framesToLevelEnd--;
			if(this._framesToLevelEnd <= 0) {
				this.hasEnded = true;
			}
		}
		if(this._frame % 10 === 0) {
			this._cullDeadObjects();
		}
	};
	Level.prototype.endOfFrame = function() {
		if(this.player && this.player.health <= 0 && !this._isEndingLevel) {
			this.endLevel();
		}
	};
	Level.prototype.endLevel = function() {
		this._isEndingLevel = true;
		this._framesToLevelEnd = 25;
		this.timeScale = 10.0;
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
	Level.prototype.renderHUD = function(ctx, camera) {
		//draw black backdrop to HUD
		ctx.fillStyle = '#111';
		ctx.fillRect(0, 0, Global.WIDTH, 60);

		//draw HUD elements
		this.bossHealthBar.render(ctx);
		this.playerHealthBar.render(ctx);
		if(Global.DEV_MODE || Global.DEBUG_MODE) {
			ctx.lineStyle = '#fff';
			ctx.thickness = 0.5;
			ctx.strokeRect(this.bounds.left - camera.x, this.bounds.top - camera.y, this.bounds.width, this.bounds.height);
		}
	};
	return Level;
});