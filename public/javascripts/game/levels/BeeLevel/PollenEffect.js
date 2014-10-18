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
	var SPRITE = SpriteLoader.loadSpriteSheet('POLLEN');
	function PollenEffect(x, y) {
		SUPERCLASS.call(this, x, y);
		this._frame = 0;
		this._framesLeftAlive = 39;
	}
	PollenEffect.prototype = Object.create(Effect.prototype);
	PollenEffect.prototype.update = function() {
		this.pos.y -= 1;
		this._frame++;
		this._framesLeftAlive--;
	};
	PollenEffect.prototype.isAlive = function() {
		return this._framesLeftAlive >= 0;
	};
	PollenEffect.prototype.render = function(ctx, camera) {
		SPRITE.render(ctx, camera, this.pos.x, this.pos.y, Math.floor(this._frame / 10));
	};
	return PollenEffect;
});