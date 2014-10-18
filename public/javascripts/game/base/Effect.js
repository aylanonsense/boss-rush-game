if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Effect(x, y) {
		this.pos = { x: x, y: y };
	}
	Effect.prototype.isAlive = function() {
		return true;
	};
	Effect.prototype.update = function() {
		//to be implemented in subclasses
	};
	Effect.prototype.render = function(ctx, camera) {
		//to be implemented in subclasses
	};
	return Effect;
});