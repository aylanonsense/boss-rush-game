if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/display/SpriteLoader'
], function(
	Global,
	SpriteLoader
) {
	function Widget(x, y, spriteKey, frame, flip) {
		this._x = x;
		this._y = y;
		this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
		this._frame = frame || 0;
		this._flipped = flip || false;
	}
	Widget.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			this._sprite.render(ctx, camera, this._x, this._y, this._frame, this._flipped);
		}
	};
	return Widget;
});