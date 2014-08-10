/* istanbul ignore if  */ if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	var START_TIME = Date.now();
	function areRectsColliding(rect1, rect2) {
		return rect1 && rect2 &&
			rect1.width > 0 && rect2.width > 0 &&
			rect1.height > 0 && rect2.height > 0 &&
			((rect1.x <= rect2.x && rect1.x + rect1.width > rect2.x) ||
			(rect2.x <= rect1.x && rect2.x + rect2.width > rect1.x)) &&
			((rect1.y <= rect2.y && rect1.y + rect1.height > rect2.y) ||
			(rect2.y <= rect1.y && rect2.y + rect2.height > rect1.y));
	}
	function toLine(start, end) {
		if(arguments.length === 4) {
			start = { x: arguments[0], y: arguments[1] };
			end = { x: arguments[2], y: arguments[3] };
		}
		var diffX = end.x - start.x;
		var diffY = end.y - start.y;
		if(diffX === 0 && diffY === 0) {
			return {
				isVertical: false,
				isSinglePoint: true,
				x: start.x,
				y: start.y,
				dist: 0,
				diff: { x: 0, y: 0 },
				start: { x: start.x, y: start.y },
				end: { x: end.x, y: end.y }
			};
		}
		var dist = Math.sqrt(diffX * diffX + diffY * diffY);
		var slope = diffY / diffX;
		if(slope === Infinity || slope === -Infinity) {
			return {
				isVertical: true,
				isSinglePoint: false,
				x: start.x,
				dist: dist,
				diff: { x: diffX, y: diffY },
				start: { x: start.x, y: start.y },
				end: { x: end.x, y: end.y }
			};
		}
		return {
			isVertical: false,
			isSinglePoint: false,
			m: slope,
			b: end.y - slope * end.x,
			dist: dist,
			diff: { x: diffX, y: diffY },
			start: { x: start.x, y: start.y },
			end: { x: end.x, y: end.y }
		};
	}
	function isLineBetweenParallelLines(line, parallelLine1, parallelLine2, leeway) {
		if(!line || !parallelLine1 || !parallelLine2) {
			return false;
		}
		if(parallelLine1.isSinglePoint !== parallelLine2.isSinglePoint) { throw new Error("How can a point and a line be parallel?"); }
		if(parallelLine1.isVertical !== parallelLine2.isVertical) { throw new Error("How can a vertical line and a non-verticla line be parallel?"); }
		//if(parallelLine1.m !== parallelLine2.m) { throw new Error("How can two lines with diffent slopes be parallel? " + parallelLine1.m + " " + parallelLine2.m); }

		var c = leeway || 0;
		var relativeStartPos = 'between';
		var relativeEndPos = 'between';

		//vertical lines are easy
		if(parallelLine1.isVertical) {
			if(line.start.x - c <= parallelLine1.x && line.start.x - c <= parallelLine2.x) {
				relativeStartPos = 'below';
			}
			else if(line.start.x + c >= parallelLine1.x && line.start.x + c >= parallelLine2.x) {
				relativeStartPos = 'above';
			}
			if(line.end.x - c <= parallelLine1.x && line.end.x - c <= parallelLine2.x) {
				relativeEndPos = 'below';
			}
			else if(line.end.x + c >= parallelLine1.x && line.end.x + c >= parallelLine2.x) {
				relativeEndPos = 'above';
			}
		}
		else {
			var startY1 = parallelLine1.m * line.start.x + parallelLine1.b;
			var startY2 = parallelLine2.m * line.start.x + parallelLine2.b;
			var endY1 = parallelLine1.m * line.end.x + parallelLine1.b;
			var endY2 = parallelLine2.m * line.end.x + parallelLine2.b;
			if(line.start.y - c <= startY1 && line.start.y - c <= startY2) {
				relativeStartPos = 'below';
			}
			else if(line.start.y + c >= startY1 && line.start.y + c >= startY2) {
				relativeStartPos = 'above';
			}
			if(line.end.y - c <= endY1 && line.end.y - c <= endY2) {
				relativeEndPos = 'below';
			}
			else if(line.end.y + c >= endY1 && line.end.y + c >= endY2) {
				relativeEndPos = 'above';
			}
		}
		return (relativeStartPos !== 'below' || relativeEndPos !== 'below') && (relativeStartPos !== 'above' || relativeEndPos !== 'above');
	}
	function findLineToLineIntersection(line1, line2, leeway, ignoreLine2Endpoints) {
		if(!line1 || !line2) {
			return null;
		}
		var c = leeway || 0;
		var intersection = null;
		var k, intersectionX, intersectionY;
		if(line1.isSinglePoint) {
			if(line2.isSinglePoint) {
				//two points intersect iif they are the same point
				if(line1.x === line2.x && line1.y === line2.y) {
					intersection = {
						x: line1.x,
						y: line1.y
					};
				}
			}
			else if(line2.isVertical) {
				//a vertical line intersects a point iff they have the same x coordinate
				if(line1.x === line2.x) {
					intersection = {
						x: line1.x,
						y: line1.y
					};
				}
			}
			else {
				//a point intersects a line iff its x-value satisfies the line equation and equals its y-value
				if(line1.y - c <= (line2.m * line1.x + line2.b) && (line2.m * line1.x + line2.b) <= line1.y + c) {
					intersection = {
						x: line1.x,
						y: line1.y
					};
				}
			}
		}
		else if(line1.isVertical) {
			if(line2.isSinglePoint) {
				//a vertical line intersects a point iff they have the same x coordinate
				if(line1.x === line2.x) {
					intersection = {
						x: line2.x,
						y: line2.y
					};
				}
			}
			else if(line2.isVertical) {
				//two vertical lines intersect (a lot) iif they have the same x coordinate
				if(line1.x === line2.x) {
					k = (line1.start.y < line1.end.y ? 1 : -1); //dir
					//secondary line starts before the primary line starts
					if(k * line2.start.y <= k * line1.start.y) {
						intersectionY = line1.start.y;
					}
					//secondary line is moving in the same direction
					else if(k * line2.start.y < k * line2.end.y) {
						intersectionY = (k * line2.start.y < k * line1.end.y ? line2.start.y : line1.end.y);
					}
					//secondary line ends before primary line starts
					else if(k * line2.end.y < k * line1.start.y) {
						intersectionY = line1.start.y;
					}
					else {
						intersectionY = (k * line2.end.y < k * line1.end.y ? line2.end.y : line1.end.y);
					}
					intersection = {
						x: line1.x,
						y: intersectionY
					};
				}
			}
			else {
				//a vertical line will always intersect a non-vertical line somewhere
				intersection = {
					x: line1.x,
					y: line2.m * line1.x + line2.b
				};
			}
		}
		else {
			if(line2.isSinglePoint) {
				//a point intersects a line iff its x-value satisfies the line equation and equals its y-value
				if(line2.y - c <= (line1.m * line2.x + line1.b) && (line1.m * line2.x + line1.b) <= line2.y + c) {
					intersection = {
						x: line2.x,
						y: line2.y
					};
				}
			}
			else if(line2.isVertical) {
				//a vertical line will always intersect a non-vertical line somewhere
				intersection = {
					x: line2.x,
					y: line1.m * line2.x + line1.b
				};
			}
			else if(line1.m === line2.m) {
				//parallel lines intersect if they have the same y value at x=0
				if(line1.b === line2.b) {
					k = (line1.start.x < line1.end.x ? 1 : -1); //dir
					//secondary line starts before the primary line starts
					if(k * line2.start.x <= k * line1.start.x) {
						intersectionX = line1.start.x;
					}
					//secondary line is moving in the same direction
					else if(k * line2.start.x < k * line2.end.x) {
						intersectionX = (k * line2.start.x < k * line1.end.x ? line2.start.x : line1.end.x);
					}
					//secondary line ends before primary line starts
					else if(k * line2.end.x < k * line1.start.x) {
						intersectionX = line1.start.x;
					}
					else {
						intersectionX = (k * line2.end.x < k * line1.end.x ? line2.end.x : line1.end.x);
					}
					intersection = {
						x: intersectionX,
						y: line1.m * intersectionX + line1.b
					};
				}
			}
			else {
				//if both lines are "true" lines, (b1 - b2) / (m2 - m1) will give us the intersection x-coordinate
				intersection = {
					x: (line1.b - line2.b) / (line2.m - line1.m),
					y: line1.m * (line1.b - line2.b) / (line2.m - line1.m) + line1.b
				};
			}
		}
		if(intersection) {
			intersection.x = intersection.x;
			intersection.y = intersection.y;
			intersection.intersectsBothSegments =
				//the intersection is not line 2's start point
				!(ignoreLine2Endpoints &&
				line2.start.x - c <= intersection.x && intersection.x <= line2.start.x + c &&
				line2.start.y - c <= intersection.y && intersection.y <= line2.start.y + c) &&
				//the intersection is not line 2's end point
				!(ignoreLine2Endpoints &&
				line2.end.x - c <= intersection.x && intersection.x <= line2.end.x + c &&
				line2.end.y - c <= intersection.y && intersection.y <= line2.end.y + c) &&
				//is between line 1's min and max x
				((line1.start.x <= line1.end.x && line1.start.x - c <= intersection.x && intersection.x <= line1.end.x + c) ||
				(line1.end.x < line1.start.x && line1.end.x - c <= intersection.x && intersection.x <= line1.start.x + c)) &&
				//is between line 2's min and max x
				((line2.start.x <= line2.end.x && line2.start.x - c <= intersection.x && intersection.x <= line2.end.x + c) ||
				(line2.end.x < line2.start.x && line2.end.x - c <= intersection.x && intersection.x <= line2.start.x + c)) &&
				//is between line 1's min and max y
				((line1.start.y <= line1.end.y && line1.start.y - c <= intersection.y && intersection.y <= line1.end.y + c) ||
				(line1.end.y < line1.start.y && line1.end.y - c <= intersection.y && intersection.y <= line1.start.y + c)) &&
				//is between line 2's min and max y
				((line2.start.y <= line2.end.y && line2.start.y - c <= intersection.y && intersection.y <= line2.end.y + c) ||
				(line2.end.y < line2.start.y && line2.end.y - c <= intersection.y && intersection.y <= line2.start.y + c));
		}
		return intersection;
	}
	return {
		areRectsColliding: areRectsColliding,
		toLine: toLine,
		isLineBetweenParallelLines: isLineBetweenParallelLines,
		findLineToLineIntersection: findLineToLineIntersection
	};
});