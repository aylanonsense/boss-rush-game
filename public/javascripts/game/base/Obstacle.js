if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/display/SpriteLoader'
], function(
	Global,
	SpriteLoader
) {
	function Obstacle(x, y, shape, spriteKey, frame, flip) {
		this._x = x;
		this._y = y;
		this._shape = shape;
		this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
		this._frame = frame || 0;
		this._flipped = flip || false;
	}
	Obstacle.prototype.isOverlapping = function(geom) {
		return this._shape.isOverlapping(geom);
	};
	Obstacle.prototype.render = function(ctx, camera) {
		if(Global.DEBUG_MODE) {
			this._shape.render(ctx, camera, '#06f');
		}
		else {
			this._sprite.render(ctx, camera, this._x, this._y, this._frame, this._flipped);
			if(Global.DEV_MODE) {
				this._shape.render(ctx, camera, 'rgba(255, 255, 0, 0.5)');
			}
		}
	};
	return Obstacle;
});