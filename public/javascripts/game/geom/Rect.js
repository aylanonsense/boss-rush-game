if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Rect(x, y, width, height, color) {
		this._geomType = 'rect';
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this._color = color || '#f44';
	}
	Rect.prototype.isIntersectingRect = function(rect) {
		//two rects are intersecting if their horizontal and vertical "shadows" are both intersecting
		if(rect && ((rect.x <= this.x && rect.x + rect.width > this.x) ||
			(this.x <= rect.x && this.x + this.width > rect.x)) &&
			((rect.y <= this.y && rect.y + rect.height > this.y) ||
			(this.y <= rect.y && this.y + this.height > rect.y))) {
			return {
				left: this.x,
				right: this.x + this.width,
				top: this.y,
				bottom: this.y + this.height
			};
		}
	};
	Rect.prototype.render = function(ctx, camera) {
		ctx.fillStyle = this._color;
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
	};
	return Rect;
});