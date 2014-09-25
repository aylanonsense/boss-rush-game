if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/GeometryUtils'
], function(
	GeometryUtils
) {
	function Rect(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this._color = color || '#f00';
		this._lines = [
			GeometryUtils.toLine(this.x, this.y, this.x + this.width, this.y), //top
			GeometryUtils.toLine(this.x, this.y + this.height, this.x + this.width, this.y + this.height), //bottom
			GeometryUtils.toLine(this.x, this.y, this.x, this.y + this.height), //left
			GeometryUtils.toLine(this.x + this.width, this.y, this.x + this.width, this.y + this.height) //right
		];
	}
	Rect.prototype.isIntersecting = function(rect) {
		return rect &&
			((rect.x <= this.x && rect.x + rect.width > this.x) ||
			(this.x <= rect.x && this.x + this.width > rect.x)) &&
			((rect.y <= this.y && rect.y + rect.height > this.y) ||
			(this.y <= rect.y && this.y + this.height > rect.y));
	};
	Rect.prototype.isIntersectingLine = function(line) {
		var earliestIntersection = null;
		for(var i = 0; i < this._lines.length; i++) {
			var intersection = GeometryUtils.findLineToLineIntersection(line, this._lines[i]);
			if(intersection && intersection.intersectsBothSegments) {
				if(!earliestIntersection ||
					intersection.squareDistFromLine1Start < earliestIntersection.squareDistFromLine1Start) {
					earliestIntersection = intersection;
				}
			}
		}
		return earliestIntersection;
	};
	Rect.prototype.render = function(ctx, camera) {
		ctx.fillStyle = this._color;
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
	};
	return Rect;
});