if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Actor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/display/SpriteLoader'
], function(
	Global,
	Actor,
	Hitbox,
	Rect,
	SpriteLoader
) {
	var SUPERCLASS = Actor;
	var SPRITE = SpriteLoader.loadSpriteSheet('FIRE_PILLAR');
	function FirePillar(level, x, y) {
		this.width = 30;
		this.height = 156;
		x -= this.width / 2;
		y -= this.height;
		SUPERCLASS.call(this, level, x, y);
		this._frame = 0;
	}
	FirePillar.prototype = Object.create(SUPERCLASS.prototype);
	FirePillar.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
	};
	FirePillar.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._frame < 1 * 8) { frame = 0; }
			else if(this._frame < 2 * 8) { frame = 1; }
			else if(this._frame < 3 * 8) { frame = 2; }
			else if(this._frame < 4 * 8) { frame = 3; }
			else { frame = 4; }
			SPRITE.render(ctx, camera, this.pos.x - 6, this.pos.y - 18, frame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	FirePillar.prototype._recalculateHitBoxes = function() {
		if(1 * 8 <= this._frame && this._frame < 2 * 8) {
			this._hurtboxes = [
				new Hitbox({
					type: 'player',
					shape: new Rect(this.pos.x, this.pos.y + 66, this.width, this.height - 66),
					onHit: function(player) { player.hurt(3); }
				})
			];
		}
		else if(2 * 8 <= this._frame && this._frame < 4 * 8) {
			this._hurtboxes = [
				new Hitbox({
					type: 'player',
					shape: new Rect(this.pos.x, this.pos.y, this.width, this.height),
					onHit: function(player) { player.hurt(3); }
				})
			];
		}
		else {
			this._hurtboxes = [];
		}
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	FirePillar.prototype.isAlive = function() {
		return this._frame < 5 * 8;
	};
	return FirePillar;
});