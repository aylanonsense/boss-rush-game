if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/LineObstacle'
], function(
	LineObstacle
) {
	function Level() {
		this.obstacles = [];
		this._polys = [];
		this.startingPoint = { x: 0, y: 0 };
	}
	Level.prototype.render = function(ctx, camera) {
		for(var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].render(ctx, camera);
		}
	};
	Level.prototype._createPoly = function(points) {
		var i, line;
		var poly = {
			points: points,
			lines: []
		};
		for(i = 0; i < points.length - 2; i += 2) {
			line = new LineObstacle(points[i + 2], points[i + 3], points[i], points[i + 1]);
			poly.lines.push(line);
		}
		this._polys.push(poly);
		this.obstacles = this.obstacles.concat(poly.lines);
	};
	Level.prototype.importLevel = function(level) {
		this._polys = [];
		this.obstacles = [];
		for(var i = 0; i < level.length; i++) {
			this._createPoly(level[i]);
		}
	};
	return Level;
});