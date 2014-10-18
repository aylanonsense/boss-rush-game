if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants',
	'game/display/SpriteLoader'
], function(
	Constants,
	SpriteLoader
) {
	function Widget(spriteKey, x, y, frame, flip) {
		this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
		this._x = x;
		this._y = y;
		this._frame = frame || 0;
		this._flipped = flip || false;
	}
	Widget.prototype.render = function(ctx, camera) {
		if(!Constants.DEBUG_MODE) {
			this._sprite.render(ctx, camera, this._x, this._y, this._frame, this._flipped);
		}
	};
	return Widget;
});