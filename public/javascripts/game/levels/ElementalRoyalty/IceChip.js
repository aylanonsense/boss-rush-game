if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Effect',
	'game/display/SpriteLoader'
], function(
	Global,
	Effect,
	SpriteLoader
) {
	var SUPERCLASS = Effect;
	var SPRITE = SpriteLoader.loadSpriteSheet('ICE_CHIP');
	function IceChip(x, y) {
		SUPERCLASS.call(this, x, y);
		//randomly determine dislay
		this._framesLeftAlive = 20 + 10 * Math.random();
		this.vel = {
			x: Math.random() * 300 - 150,
			y: Math.random() * -200 - 300
		};
		this._frame = 3 + Math.floor(3 * Math.random());
	}
	IceChip.prototype = Object.create(SUPERCLASS.prototype);
	IceChip.prototype.update = function() {
		this._framesLeftAlive--;
		this.vel.y += 25;
		this.pos.x += this.vel.x / 60;
		this.pos.y += this.vel.y / 60;
	};
	IceChip.prototype.isAlive = function() {
		return this._framesLeftAlive >= 0;
	};
	IceChip.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x - 20, this.pos.y - 20, this._frame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	return IceChip;
});