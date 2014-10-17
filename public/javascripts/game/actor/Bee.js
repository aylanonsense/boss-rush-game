if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/actor/Actor',
	'game/display/SpriteLoader'
], function(
	Actor,
	SpriteLoader
) {
	var SPRITE = SpriteLoader.loadSpriteSheet('BEE');
	function Bee(level) {
		Actor.apply(this, arguments);
		this._frame = 0;
	}
	Bee.prototype = Object.create(Actor.prototype);
	Bee.prototype.endOfFrame = function() {
		this._frame += 0.30;
	};
	Bee.prototype.render = function(ctx, camera) {
		SPRITE.render(ctx, 100 - camera.x, 100 - camera.y, Math.floor(this._frame), false);
	};
	return Bee;
});