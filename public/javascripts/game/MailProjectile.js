if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	IceBlock,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('MAIL');
	var FALLOFF_DIST = 170;
	function MailProjectile(level, x, y, dir) {
		SUPERCLASS.call(this, level, x - 7 + 7 * dir, y);
		this._frame = 0;
		this._dir = dir;
		this.vel.x = dir * 350;
		this._isAlive = true;
		this._startingPosX = this.pos.x;
	}
	MailProjectile.prototype = Object.create(SUPERCLASS.prototype);
	MailProjectile.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		if(this._isSlowingDown) {
			this.vel.x *= 0.85;
			this._framesSpentSlowingDown++;
			if(this._framesSpentSlowingDown > 6) {
				this._isAlive = false;
			}
		}
		if(Math.abs(this.pos.x - this._startingPosX) > FALLOFF_DIST && !this._isSlowingDown) {
			this._isSlowingDown = true;
			this._framesSpentSlowingDown = 0;
		}
	};
	MailProjectile.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._frame < 10) { frame = 0; }
			else if(this._frame < 18) { frame = 1; }
			else if(this._frame < 26) { frame = 2; }
			else if(this._frame < 34) { frame = 3; }
			else { frame = 4; }
			SPRITE.render(ctx, camera, this.pos.x - 1 + 1 * this._dir, this.pos.y - 4, frame, this._dir < 0);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	MailProjectile.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
	};
	MailProjectile.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hurtboxes = [
			new Hitbox({
				type: 'enemy',
				shape: new Rect(this.pos.x, this.pos.y, 14, 8),
				onHit: function() {
					self._isAlive = false;
				}
			})
		];
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	MailProjectile.prototype.finishMovement = function() {
		SUPERCLASS.prototype.finishMovement.apply(this, arguments);
	};
	MailProjectile.prototype.isAlive = function() {
		return this._isAlive;
	};
	return MailProjectile;
});