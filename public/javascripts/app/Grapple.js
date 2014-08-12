if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils'
], function(
	GeometryUtils
) {
	var GRAPPLE_SPEED = 1200;
	var K = 2000;
	function Grapple(player, dirX, dirY) {
		var dir = Math.sqrt(dirX * dirX + dirY * dirY);
		this._player = player;
		var x = this._player.pos.x + this._player.grappleOffset.x;
		var y = this._player.pos.y + this._player.grappleOffset.y;
		this.pos = { x: x, y: y };
		this.pos.prev = { x: x, y: y };
		this.vel = { x: GRAPPLE_SPEED * dirX / dir, y: GRAPPLE_SPEED * dirY / dir };
		this.isLatched = false;
		this._latchDist = null;
		this._recalculateMovementVectors();
	}
	Grapple.prototype.tick = function(ms) {
		this.move(ms);
	};
	Grapple.prototype.move = function(ms) {
		var t = ms / 1000;
		if(!this.isLatched) {
			this.pos.prev.x = this.pos.x;
			this.pos.prev.y = this.pos.y;
			this.pos.x += this.vel.x * t;
			this.pos.y += this.vel.y * t;
			this._recalculateMovementVectors();
		}
	};
	Grapple.prototype.latchTo = function(x, y) {
		this.pos.x = x;
		this.pos.y = y;
		this.pos.prev.x = x;
		this.pos.prev.y = y;
		this.isLatched = true;
		var dx = x - this._player.pos.x;
		var dy = y - this._player.pos.y;
		this._latchDist = Math.sqrt(dx * dx + dy * dy);
		this._recalculateMovementVectors();
	};
	Grapple.prototype._recalculateMovementVectors = function() {};
	Grapple.prototype.applyForceToPlayer = function() {
		var dx = this.pos.x - this._player.pos.x;
		var dy = this.pos.y - this._player.pos.y;
		var dist = Math.sqrt(dx * dx + dy * dy);
		var excessDist = dist - this._latchDist;
		if(excessDist > 0) {
			this._player.applyForce(K * excessDist / this._latchDist, dx, dy);
		}
	};
	Grapple.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#444';
		ctx.lineWidth = 3;
		ctx.beginPath();
		ctx.moveTo(this._player.pos.x + this._player.grappleOffset.x - camera.x,
			this._player.pos.y + this._player.grappleOffset.y - camera.y);
		ctx.lineTo(this.pos.x - camera.x, this.pos.y - camera.y);
		ctx.stroke();
	};
	return Grapple;
});