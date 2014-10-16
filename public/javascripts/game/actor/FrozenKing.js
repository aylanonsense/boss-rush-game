if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants',
	'game/geom/Rect',
	'game/display/SpriteLoader'
], function(
	Constants,
	Rect,
	SpriteLoader
) {
	var SPRITE = SpriteLoader.loadSpriteSheet('FROZEN_KING');
	function FrozenKing() {
		this._x = 500;
		this._y = 300;
		this._f = 0;
	}
	FrozenKing.prototype.render = function(ctx, camera) {
		this._f++;
		if(this._f > 90) {
			this._f = 0;
		}
		SPRITE.render(ctx, this._x - camera.x, this._y - camera.y, (this._f > 45 ? 9 : 0));
	};
	return FrozenKing;
});