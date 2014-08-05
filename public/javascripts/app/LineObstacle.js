if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Obstacle',
	'app/GeometryUtils'
], function(
	Obstacle,
	GeometryUtils
) {
	function LineObstacle(x1, y1, x2, y2) {
		Obstacle.apply(this, arguments);
		this.obstacleType = 'line';
		this._line = GeometryUtils.toLine.apply(GeometryUtils, arguments);

		//cached math for handling collisions
		var angle = Math.atan2(this._line.diff.y, this._line.diff.x);
		this._cosOfLineAngle = Math.cos(angle);
		this._sinOfLineAngle = Math.sin(angle);

		//cached math for rendering the 'pip'
		this._pip = {
			start: {
				x: (this._line.start.x + this._line.end.x) / 2,
				y: (this._line.start.y + this._line.end.y) / 2
			},
			end: {
				x: (this._line.start.x + this._line.end.x) / 2 + 10 * Math.cos(angle - Math.PI / 2),
				y: (this._line.start.y + this._line.end.y) / 2 + 10 * Math.sin(angle - Math.PI / 2)
			}
		};
	}
	LineObstacle.prototype = Object.create(Obstacle.prototype);
	LineObstacle.prototype.checkForCollisionWithPlayer = function(player) {
		var potentialIntersections = [];
		//var firstIntersection = null;
		//var firstIntersectionSquareDist = null;
		//var firstIntersectionLine = null;
		for(var i = 0; i < player.collisionLines.length; i++) {
			var intersection = GeometryUtils.findLineToLineIntersection(player.collisionLines[i], this._line, 0.0000000001);
			if(intersection && intersection.intersectsBothSegments) {
				//collisions only happen if the player's moving "towards" the line (from the "solid" side)
				if(player.vel.x * this._sinOfLineAngle + player.vel.y * -this._cosOfLineAngle > 0) {
					//figure out the distance to the intersection point, since we want the one closest
					var dx = intersection.x - player.collisionLines[i].start.x;
					var dy = intersection.y - player.collisionLines[i].start.y;
					var squareDistToIntersection = dx * dx + dy * dy;
					potentialIntersections.push({
						intersection: intersection,
						squareDist: squareDistToIntersection,
						line: player.collisionLines[i]
					});
					/*if(firstIntersectionSquareDist === null || squareDistToIntersection < firstIntersectionSquareDist) {
						firstIntersection = intersection;
						firstIntersectionSquareDist = squareDistToIntersection;
						firstIntersectionLine = player.collisionLines[i];
					}*/
				}
			}
		}
		var startLine = GeometryUtils.toLine(
			this._line.start.x - player.lineOfMovement.diff.x,
			this._line.start.y - player.lineOfMovement.diff.y,
			this._line.start.x, this._line.start.y);
		var endLine = GeometryUtils.toLine(
			this._line.end.x - player.lineOfMovement.diff.x,
			this._line.end.y - player.lineOfMovement.diff.y,
			this._line.end.x, this._line.end.y);
		var midwayIntersections = [
			{ isHorizontal: false, line: startLine, intersection: GeometryUtils.findLineToLineIntersection(startLine, player._verticalBound, 0.0000000001) },
			{ isHorizontal: false, line: endLine, intersection: GeometryUtils.findLineToLineIntersection(endLine, player._verticalBound, 0.0000000001) },
			{ isHorizontal: true, line: startLine, intersection: GeometryUtils.findLineToLineIntersection(startLine, player._horizontalBound, 0.0000000001) },
			{ isHorizontal: true, line: endLine, intersection: GeometryUtils.findLineToLineIntersection(endLine, player._horizontalBound, 0.0000000001) }
		];
		for(i = 0; i < midwayIntersections.length; i++) {
			var a = midwayIntersections[i];
			if(a.intersection && a.intersection.intersectsBothSegments) {
				var dx2 = a.line.end.x - a.intersection.x;
				var dy2 = a.line.end.y - a.intersection.y;
				var squareDist2 = dx2 * dx2 + dy2 * dy2;
				potentialIntersections.push({
					intersection: a.line.end,
					squareDist: squareDist2,
					line: a.line,
					isHorizontal: a.isHorizontal,
					bloop: true
				});
			}
		}
		potentialIntersections.sort(function(a, b) { return a.squareDist - b.squareDist; });
		if(potentialIntersections.length > 0) {
			var bill = potentialIntersections[0];
			var self = this;
			if(bill.bloop) {
				var dx3 = bill.line.end.x - bill.intersection.x;
				var dy3 = bill.line.end.y - bill.intersection.y;
				return {
					key: 'Collision with line ' + this._obstacleId,
					x: player.pos.prev.x + dx3,
					y: player.pos.prev.y + dy3,
					squareDistTo: bill.squareDist,
					handle: function() {
						if(bill.isHorizontal) {
							player.vel.x = 0;
						}
						else {
							player.vel.y = 0;
						}
					}
				};
			}
			else {
				return {
					key: 'Collision with line ' + this._obstacleId,
					x: bill.intersection.x - bill.line.start.x + player.pos.prev.x,
					y: bill.intersection.y - bill.line.start.y + player.pos.prev.y,
					squareDistTo: bill.squareDist,
					handle: function() {
						//rotate the velocity to vectors parallel (x) and perpendicular (y) to the line segment
						var rotatedPlayerVelocity = {
							x: player.vel.x * -self._cosOfLineAngle + player.vel.y * -self._sinOfLineAngle,
							y: player.vel.x * self._sinOfLineAngle + player.vel.y * -self._cosOfLineAngle
						};

						//any velocity perpendicular (y) to the line segment is lost in the collision
						rotatedPlayerVelocity.y = 0;

						//apply the new velocity
						player.vel.x = rotatedPlayerVelocity.x * -self._cosOfLineAngle + rotatedPlayerVelocity.y * self._sinOfLineAngle;
						player.vel.y = rotatedPlayerVelocity.x * -self._sinOfLineAngle + rotatedPlayerVelocity.y * -self._cosOfLineAngle;
						//console.log("Intersection with line", self._obstacleId);
					}
				};
			}
		}
		else {
			return null;
		}
	};
	LineObstacle.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#059';
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(this._line.start.x - camera.x, this._line.start.y - camera.y);
		ctx.lineTo(this._line.end.x - camera.x, this._line.end.y - camera.y);
		ctx.moveTo(this._pip.start.x - camera.x, this._pip.start.y - camera.y);
		ctx.lineTo(this._pip.end.x - camera.x, this._pip.end.y - camera.y);
		ctx.stroke();
	};
	return LineObstacle;
});