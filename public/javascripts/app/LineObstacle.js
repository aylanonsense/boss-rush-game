if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Obstacle',
	'app/GeometryUtils'
], function(
	Obstacle,
	GeometryUtils
) {
	var INTERSECTION_LEEWAY = 0.0000000001;
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
		var dx, dy, i;
		var collisionsThisFrame = [];

		//collisions only happen if the player's moving towards the "solid" side of the line
		if(player.vel.x * this._sinOfLineAngle + player.vel.y * -this._cosOfLineAngle <= 0) {
			return null;
		}

		//find any collisions that occur from the player's projected movement vectors
		for(i = 0; i < player.collisionLines.length; i++) {
			var intersection = GeometryUtils.findLineToLineIntersection(player.collisionLines[i], this._line, INTERSECTION_LEEWAY);
			if(intersection && intersection.intersectsBothSegments) {
				//figure out the distance to the intersection point, since we want the one closest
				dx = intersection.x - player.collisionLines[i].start.x;
				dy = intersection.y - player.collisionLines[i].start.y;
				collisionsThisFrame.push({
					intersection: intersection,
					squareDist: dx * dx + dy * dy,
					line: player.collisionLines[i],
					isEndpointCollision: false
				});
			}
		}

		//find any collisions that occur from the player's movement projected to the line's endpoints
		var toLineStart = GeometryUtils.toLine(this._line.start.x - player.lineOfMovement.diff.x,
			this._line.start.y - player.lineOfMovement.diff.y, this._line.start.x, this._line.start.y);
		var toLineEnd = GeometryUtils.toLine(this._line.end.x - player.lineOfMovement.diff.x,
			this._line.end.y - player.lineOfMovement.diff.y, this._line.end.x, this._line.end.y);
		var endpointCollisions = [
			{ intersection: GeometryUtils.findLineToLineIntersection(toLineStart, player.leadingTopOrBottomEdge, INTERSECTION_LEEWAY),
				isLeftOrRightEdge: false, line: toLineStart },
			{ intersection: GeometryUtils.findLineToLineIntersection(toLineEnd, player.leadingTopOrBottomEdge, INTERSECTION_LEEWAY),
				isLeftOrRightEdge: false, line: toLineEnd },
			{ intersection: GeometryUtils.findLineToLineIntersection(toLineStart, player.leadingLeftOrRightEdge, INTERSECTION_LEEWAY),
				isLeftOrRightEdge: true, line: toLineStart },
			{ intersection: GeometryUtils.findLineToLineIntersection(toLineEnd, player.leadingLeftOrRightEdge, INTERSECTION_LEEWAY),
				isLeftOrRightEdge: true, line: toLineEnd }
		];
		for(i = 0; i < endpointCollisions.length; i++) {
			if(endpointCollisions[i].intersection && endpointCollisions[i].intersection.intersectsBothSegments) {
				dx = endpointCollisions[i].line.end.x - endpointCollisions[i].intersection.x;
				dy = endpointCollisions[i].line.end.y - endpointCollisions[i].intersection.y;
				collisionsThisFrame.push({
					intersection: endpointCollisions[i].line.end,
					squareDist: dx * dx + dy * dy,
					line: endpointCollisions[i].line,
					isEndpointCollision: true,
					isLeftOrRightEdge: endpointCollisions[i].isLeftOrRightEdge //true iff colliding with the player's left or right bound
				});
			}
		}

		//we only care about the earliest collision
		collisionsThisFrame.sort(function(a, b) { return a.squareDist - b.squareDist; });
		var collision = collisionsThisFrame[0] || null;
		if(collision) {
			var self = this;
			if(collision.isEndpointCollision) {
				return {
					key: 'Collision with line ' + this._obstacleId,
					x: player.pos.prev.x + collision.line.end.x - collision.intersection.x,
					y: player.pos.prev.y + collision.line.end.y - collision.intersection.y,
					squareDistTo: collision.squareDist,
					handle: function() {
						//endpoint collisions are easy, they either cancel out all vertical or all horizontal velocity
						if(collision.isLeftOrRightEdge) {
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
					x: collision.intersection.x - collision.line.start.x + player.pos.prev.x,
					y: collision.intersection.y - collision.line.start.y + player.pos.prev.y,
					squareDistTo: collision.squareDist,
					handle: function() {
						//rotate the velocity to vectors parallel (x) and perpendicular (y) to the line segment
						var rotatedPlayerVelocity = {
							x: player.vel.x * -self._cosOfLineAngle + player.vel.y * -self._sinOfLineAngle,
							y: player.vel.x * self._sinOfLineAngle + player.vel.y * -self._cosOfLineAngle
						};

						//any velocity perpendicular (y) to the line segment is lost in the collision
						rotatedPlayerVelocity.y = 0;

						//apply the new velocity
						player.vel.x = rotatedPlayerVelocity.x * -self._cosOfLineAngle +
							rotatedPlayerVelocity.y * self._sinOfLineAngle;
						player.vel.y = rotatedPlayerVelocity.x * -self._sinOfLineAngle +
							rotatedPlayerVelocity.y * -self._cosOfLineAngle;
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