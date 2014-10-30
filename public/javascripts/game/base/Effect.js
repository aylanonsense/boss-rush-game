if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global'
], function(
	Global
) {
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
		if(Global.DEV_MODE && !Global.DEBUG_MODE) {
			//draw position
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 1;
			ctx.beginPath();
			ctx.moveTo(this.pos.x - camera.x, this.pos.y + 5 - camera.y);
			ctx.lineTo(this.pos.x - camera.x, this.pos.y - camera.y);
			ctx.lineTo(this.pos.x + 5 - camera.x, this.pos.y - camera.y);
			ctx.stroke();
		}
	};
	return Effect;
});