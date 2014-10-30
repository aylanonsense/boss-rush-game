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
	var SPRITE = SpriteLoader.loadSpriteSheet('FROZEN_KING_SCEPTER_SHINE');
	function ScepterShine(x, y) {
		SUPERCLASS.call(this, x, y);
		//randomly determine dislay
		this._framesLeftAlive = 6 * 4;
	}
	ScepterShine.prototype = Object.create(SUPERCLASS.prototype);
	ScepterShine.prototype.update = function() {
		this._framesLeftAlive--;
	};
	ScepterShine.prototype.isAlive = function() {
		return this._framesLeftAlive >= 0;
	};
	ScepterShine.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, 5 - Math.floor(this._framesLeftAlive / 4));
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	return ScepterShine;
});