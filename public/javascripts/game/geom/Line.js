if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Line(start, end, color) {
		if(arguments.length >= 4) {
			start = { x: arguments[0], y: arguments[1] };
			end = { x: arguments[2], y: arguments[3] };
			color = (arguments.length > 4 ? arguments[4] : null);
		}
		this._color = color || '#f00';
		this._start = start;
		this._end = end;
		var dx = end.x - start.x;
		var dy = end.y - start.y;
		if(dx === 0 && dy === 0) {
			this._isSinglePoint = true;
		}
		else {
			this._isSinglePoint = false;
			if(dx === 0) {
				this._useReciprocalSlope = true;
				this._reciprocalSlope = 0;
				this._xAtOrigin = start.x;
			}
			else if(dy === 0) {
				this._useReciprocalSlope = false;
				this._slope = 0;
				this._yAtOrigin = start.y;
			}
			else {
				if(-dx < dy && dy < dx) {
					this._useReciprocalSlope = false;
					this._slope = dy / dx;
					this._yAtOrigin = start.y - this._slope * start.x;
				}
				else {
					this._useReciprocalSlope = true;
					this._reciprocalSlope = dx / dy;
					this._xAtOrigin = start.x - this._reciprocalSlope * start.y;
				}
			}
		}
	}
	Line.prototype._getYWhenXIs = function(x) {
		if((this._start.x <= x && x <= this._end.x) ||
			(this._start.x >= x && x >= this._end.x)) {
			if(this._isSinglePoint) {
				return this._start.y;
			}
			else if(this._useReciprocalSlope) {
				return (x - this._xAtOrigin) / this._reciprocalSlope;
			}
			else {
				return this._slope * x + this._yAtOrigin;
			}
		}
		return null;
	};
	Line.prototype._getXWhenYIs = function(y) {
		if((this._start.y <= y && y <= this._end.y) ||
			(this._start.y >= y && y >= this._end.y)) {
			if(this._isSinglePoint) {
				return this._start.x;
			}
			else if(this._useReciprocalSlope) {
				return this._reciprocalSlope * y + this._xAtOrigin;
			}
			else {
				return (y - this._yAtOrigin) / this._slope;
			}
		}
		return null;
	};
	Line.prototype.isCrossingRect = function(rect) {
		//find intersections along the top/bottom/left/right
		var intersections = [];
		var xAlongTop = this._getXWhenYIs(rect.y);
		if(xAlongTop !== null && rect.x <= xAlongTop && xAlongTop <= rect.x + rect.width) {
			intersections.push({ x: xAlongTop, y: rect.y });
		}
		var xAlongBottom = this._getXWhenYIs(rect.y + rect.height);
		if(xAlongBottom !== null && rect.x <= xAlongBottom && xAlongBottom <= rect.x + rect.width) {
			intersections.push({ x: xAlongBottom, y: rect.y + rect.height });
		}
		var yAlongLeft = this._getYWhenXIs(rect.x);
		if(yAlongLeft !== null && rect.y <= yAlongLeft && yAlongLeft <= rect.y + rect.height) {
			intersections.push({ x: rect.x, y: yAlongLeft });
		}
		var yAlongRight = this._getYWhenXIs(rect.x + rect.width);
		if(yAlongRight !== null && rect.y <= yAlongRight && yAlongRight <= rect.y + rect.height) {
			intersections.push({ x: rect.x + rect.width, y: yAlongRight });
		}
		//choose the earliest intersection
		var earliestIntersection = null;
		for(var i = 0; i < intersections.length; i++) {
			var dx = intersections[i].x - this._start.x;
			var dy = intersections[i].y - this._start.y;
			intersections[i].squareDist = dx * dx + dy * dy;
			if(earliestIntersection === null || intersections[i].squareDist < earliestIntersection.squareDist) {
				earliestIntersection = intersections[i];
			}
		}
		return earliestIntersection;
	};
	Line.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = this._color;
		ctx.lineWidth = 1;
		ctx.moveTo(this._start.x - camera.x, this._start.y - camera.y);
		ctx.lineTo(this._end.x - camera.x, this._end.y - camera.y);
	};
	return Line;
});
//SILVER star status!