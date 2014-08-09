if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/LineObstacle'
], function(
	LineObstacle
) {
	function EditableLevel(level) {
		this.obstacles = [];
		this.startingPoint = { x: 0, y: 0 };
		this._polys = [];
		if(level || document.cookie) {
			this.importLevel(level || JSON.parse(document.cookie));
		}
	}
	EditableLevel.prototype.render = function(ctx, camera) {
		for(var i = 0; i < this.obstacles.length; i++) {
			this.obstacles[i].render(ctx, camera);
		}
	};
	EditableLevel.prototype.createPoly = function(points) {
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
	EditableLevel.prototype.deleteLastCreatedPoly = function() {
		this._polys.pop();
		this.obstacles = [];
		for(var i = 0; i < this._polys.length; i++) {
			this.obstacles = this.obstacles.concat(this._polys[i].lines);
		}
	};
	EditableLevel.prototype.exportLevel = function() {
		var level = [];
		for(var i = 0; i < this._polys.length; i++) {
			level.push(this._polys[i].points);
		}
		console.log(JSON.stringify(level));
		document.cookie = JSON.stringify(level);
	};
	EditableLevel.prototype.importLevel = function(level) {
		this._polys = [];
		this.obstacles = [];
		for(var i = 0; i < level.length; i++) {
			this.createPoly(level[i]);
		}
	};
	return EditableLevel;
});