if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/geom/Line',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	Line,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('FIREBALL');
	function Fireball(level, x, y, targetX, targetY) {
		x -= 12;
		y -= 12;
		SUPERCLASS.call(this, level, x, y);
		this.width = 24;
		this.height = 24;
		var speed = 900;
		var dx = targetX - x;
		var dy = targetY - y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		var angle = Math.atan2(dy, dx);
		var dir = Math.round(((angle + 3 / 2 * Math.PI) % (2 * Math.PI)) * (6 / Math.PI));
		this.vel.x = speed * dx / dist;
		this.vel.y = speed * dy / dist;
		this.collidesWithActors = false;
		this._flipped = dir > 6;
		this._renderFrame = (dir > 6 ? 12 - dir : dir);
		this._framesLeftExploding = null;
	}
	Fireball.prototype = Object.create(SUPERCLASS.prototype);
	Fireball.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		if(this._framesLeftExploding !== null) {
			this._framesLeftExploding--;
		}
	};
	Fireball.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._framesLeftExploding === null) {
				frame = this._renderFrame;
			}
			else {
				if(this._framesLeftExploding > 15) { frame = 7; }
				else if(this._framesLeftExploding > 10) { frame = 8; }
				else if(this._framesLeftExploding > 5) { frame = 9; }
				else { frame = 10; }
			}
			SPRITE.render(ctx, camera, this.pos.x - 54, this.pos.y - 54, frame, this._flipped);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	Fireball.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 24, 24);
	};
	Fireball.prototype._recalculateHitBoxes = function() {
		var self = this;
		if(this._framesLeftExploding === null || this._framesLeftExploding > 10) {
			this._hurtboxes = [
				new Hitbox({
					type: 'player',
					shape: (this._framesLeftExploding === null ?
						new Rect(this.pos.x, this.pos.y, 24, 24) :
						new Rect(this.pos.x - 10, this.pos.y - 10, 44, 44)),
					onHit: function(player) { player.hurt(3); }
				})
			];
		}
		else {
			this._hurtboxes = [];
		}
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	Fireball.prototype.isAlive = function() {
		return this._framesLeftExploding === null || this._framesLeftExploding > 0;
	};
	Fireball.prototype._onCollided = function(thing, dir) {
		this._framesLeftExploding = 20;
		this.vel.x = 0;
		this.vel.y =0;
		this._flipped = false;
	};
	return Fireball;
});