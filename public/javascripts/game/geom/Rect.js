if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/geom/Line'
], function(
	Line
) {
	function Rect(x, y, width, height, color) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this._color = color || '#f00';
	}
	Rect.prototype.isIntersecting = function(other) {
		return other &&
			((other.x <= this.x && other.x + other.width > this.x) ||
			(this.x <= other.x && this.x + this.width > other.x)) &&
			((other.y <= this.y && other.y + other.height > this.y) ||
			(this.y <= other.y && this.y + this.height > other.y));
	};
	Rect.prototype.render = function(ctx, camera) {
		ctx.fillStyle = this._color;
		ctx.fillRect(this.x - camera.x, this.y - camera.y, this.width, this.height);
	};
	return Rect;
});