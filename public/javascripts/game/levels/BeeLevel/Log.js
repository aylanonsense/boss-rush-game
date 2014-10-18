if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/base/Obstacle',
	'game/geom/Multi',
	'game/geom/Triangle',
	'game/geom/Rect'
], function(
	Obstacle,
	Multi,
	Triangle,
	Rect
) {
	var SUPERCLASS = Obstacle;
	function Log(x, y) {
		SUPERCLASS.call(this, x, y, new Multi([
			new Triangle(x, y, 115, 30, 'lower-right'),
			new Rect(x, y + 30, 115, 42)
		]), 'LOG', 0, false);
	}
	Log.prototype = Object.create(SUPERCLASS.prototype);
	return Log;
});