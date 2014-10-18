if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/display/SpriteLoader'
], function(
	Global,
	SpriteLoader
) {
	var SPRITE = SpriteLoader.loadSpriteSheet('POLLEN');
	function PollenEffect(x, y) {
		this.pos = { x: x, y: y };
		this._frame = 0;
		this._framesLeftAlive = 39;
	}
	PollenEffect.prototype.update = function() {
		this.pos.y -= 0.3;
		this._frame ++;
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