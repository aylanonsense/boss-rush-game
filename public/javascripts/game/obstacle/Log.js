if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/obstacle/Obstacle',
	'game/display/SpriteLoader',
	'game/geom/Multi',
	'game/geom/Triangle',
	'game/geom/Rect',
	'game/Constants'
], function(
	Obstacle,
	SpriteLoader,
	Multi,
	Triangle,
	Rect,
	Constants
) {
	var SPRITE = SpriteLoader.loadSpriteSheet('LOG');
	function Log(x, y) {
		this._x = x;
		this._y = y;
		this._shape = new Multi([
			new Triangle(x, y, 115, 30, 'lower-right'),
			new Rect(x, y + 30, 115, 42)
		]);
	}
	Log.prototype.isOverlapping = function(geom) {
		return this._shape.isOverlapping(geom);
	};
	Log.prototype.isCrossedBy = function(line) {
		return line.isCrossing(this._shape);
	};
	Log.prototype.render = function(ctx, camera) {
		if(Constants.DEBUG_MODE) {
			this._shape.render(ctx, camera, '#06f');
		}
		else {
			SPRITE.render(ctx, camera, this._x, this._y, 0);
			if(Constants.DEV_MODE) {
				this._shape.render(ctx, camera, 'rgba(255, 255, 0, 0.5)');
			}
		}
	};
	return Log;
});