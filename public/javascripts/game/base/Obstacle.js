if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/display/SpriteLoader',
	'game/Global'
], function(
	SpriteLoader,
	Global
) {
	function Obstacle(x, y, shape, spriteKey, frame) {
		this._x = x;
		this._y = y;
		this._shape = shape;
		this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
		this._frame = frame || 0;
	}
	Obstacle.prototype.isOverlapping = function(geom) {
		return this._shape.isOverlapping(geom);
	};
	Obstacle.prototype.render = function(ctx, camera) {
		if(Global.DEBUG_MODE) {
			this._shape.render(ctx, camera, '#06f');
		}
		else {
			this._sprite.render(ctx, camera, this._x, this._y, this._frame);
			if(Global.DEV_MODE) {
				this._shape.render(ctx, camera, 'rgba(255, 255, 0, 0.5)');
			}
		}
	};
	return Obstacle;
});