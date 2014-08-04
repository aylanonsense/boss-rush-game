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
		this._abc = false;
	}
	LineObstacle.prototype = Object.create(Obstacle.prototype);
	LineObstacle.prototype.checkForCollisionWithPlayer = function(player) {
		var firstIntersection = null;
		var firstIntersectionSquareDist = null;
		var firstIntersectionLine = null;
		for(var i = 0; i < player.collisionLines.length; i++) {
			var intersection = GeometryUtils.findLineToLineIntersection(player.collisionLines[i], this._line, 0.0000000001);
			if(intersection && intersection.intersectsBothSegments) {
				//collisions only happen if the player's moving "towards" the line (from the "solid" side)
				if(player.vel.x * this._sinOfLineAngle + player.vel.y * -this._cosOfLineAngle > 0) {
					//figure out the distance to the intersection point, since we want the one closest
					var dx = intersection.x - player.collisionLines[i].start.x;
					var dy = intersection.y - player.collisionLines[i].start.y;
					var squareDistToIntersection = dx * dx + dy * dy;
					if(firstIntersectionSquareDist === null || squareDistToIntersection < firstIntersectionSquareDist) {
						firstIntersection = intersection;
						firstIntersectionSquareDist = squareDistToIntersection;
						firstIntersectionLine = player.collisionLines[i];
					}
				}
			}
		}
		if(firstIntersection) {
			var self = this;
			this._abc = true;
			return {
				key: 'Collision with line ' + this._obstacleId,
				x: firstIntersection.x - firstIntersectionLine.start.x + player.pos.prev.x,
				y: firstIntersection.y - firstIntersectionLine.start.y + player.pos.prev.y,
				squareDistTo: firstIntersectionSquareDist,
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
		else {
			if(this._obstacleId === 2 && this._abc) {
				//console.log("No intersection with line", this._obstacleId);
				//debugger;
			}
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