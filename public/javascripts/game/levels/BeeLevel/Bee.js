if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/levels/BeeLevel/PollenEffect',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	PollenEffect,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('BEE');
	function Bee(level) {
		SUPERCLASS.apply(this, arguments);
		this._frame = 0;
		this._flipped = false;
		this.vel.x = 250;
		this.vel.y = 250;
	}
	Bee.prototype = Object.create(SUPERCLASS.prototype);
	Bee.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		if(this._frame % 13 === 0) {
			this.level.spawnEffect(new PollenEffect(this.pos.x, this.pos.y));
		}
	};
	Bee.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, Math.floor(this._frame / 3), this._flipped);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	Bee.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(5, 10, 33, 20);
	};
	Bee.prototype._onCollided = function(thing, dir) {
		if(dir === 'bottom' || dir === 'top') {
			this.vel.y *= -1;
		}
		else {
			this.vel.x *= -1;
			this._flipped = !this._flipped;
		}
	};
	return Bee;
});