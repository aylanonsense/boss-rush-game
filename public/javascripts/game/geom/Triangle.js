if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/geom/Line',
	'game/geom/Rect'
], function(
	Line,
	Rect
) {
	function Triangle(x, y, width, height, rightAngleSide, color) {
		this._geomType = 'triangle';
		this._rect = new Rect(x, y, width, height);
		if(rightAngleSide === 'upper-left') {
			this._line = new Line(x, y + height, x + width, y);
			this._points = [ { x: x, y: y }, { x: x + width, y: y }, { x: x, y: y + height } ];
		}
		else if(rightAngleSide === 'lower-right') {
			this._line = new Line(x, y + height, x + width, y);
			this._points = [ { x: x + width, y: y + height }, { x: x + width, y: y }, { x: x, y: y + height } ];
		}
		else if(rightAngleSide === 'lower-left') {
			this._line = new Line(x, y, x + width, y + height);
			this._points = [ { x: x, y: y + height }, { x: x + width, y: y + height }, { x: x, y: y } ];
		}
		else if(rightAngleSide === 'upper-right') {
			this._line = new Line(x, y, x + width, y + height);
			this._points = [ { x: x + width, y: y }, { x: x + width, y: y + height }, { x: x, y: y } ];
		}
		this._rightAngleSide = rightAngleSide;
		this._isUpper = (rightAngleSide === 'upper-left' || rightAngleSide === 'upper-right');
		this._isLeft = (rightAngleSide === 'upper-left' || rightAngleSide === 'lower-left');
		this._color = color || '#f44';
	}
	Triangle.prototype.isIntersectingRect = function(rect) {
		if(this._rect.isIntersectingRect(rect)) {
			var xRect = rect.x + (this._isLeft ? 0 : rect.width);
			var yRect = rect.y + (this._isUpper ? 0 : rect.height);
			var yLine = this._line._getYWhenXIs(xRect);
			if((this._isUpper && yRect <= yLine) || (!this._isUpper && yRect >= yLine)) {
				return {
					left: this._rect.x,
					right: this._rect.x + this._rect.width,
					top: (this._isUpper ? this._rect.y : yLine),
					bottom: (this._isUpper ? yLine : this._rect.y + this._rect.height)
				};
			}
		}
	};
	Triangle.prototype.render = function(ctx, camera) {
		ctx.beginPath();
		ctx.fillStyle = this._color;
		ctx.moveTo(this._points[2].x - camera.x, this._points[2].y - camera.y);
		for(var i = 0; i < this._points.length; i++) {
			ctx.lineTo(this._points[i].x - camera.x, this._points[i].y - camera.y);
		}
		ctx.fill();
	};
	return Triangle;
});