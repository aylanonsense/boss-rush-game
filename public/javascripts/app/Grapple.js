if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils'
], function(
	GeometryUtils
) {
	var GRAPPLE_SPEED = 1200;
	function Grapple(player, dirX, dirY) {
		var dir = Math.sqrt(dirX * dirX + dirY * dirY);
		this._player = player;
		this.pos = { x: this._player.pos.x, y: this._player.pos.y };
		this.pos.prev = { x: this._player.pos.x, y: this._player.pos.y };
		this.vel = { x: GRAPPLE_SPEED * dirX / dir, y: GRAPPLE_SPEED * dirY / dir };
		this._isLatched = false;
		this._recalculateMovementVectors();
	}
	Grapple.prototype.move = function(ms) {
		var t = ms / 1000;
		if(!this._isLatched) {
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
		this._isLatched = true;
		this._recalculateMovementVectors();
	};
	Grapple.prototype._recalculateMovementVectors = function() {
		this.lineOfMovement = (this._isLatched ? null : GeometryUtils.toLine(this.pos.prev, this.pos));
	};
	Grapple.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#888';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(this._player.pos.x - camera.x, this._player.pos.y - camera.y);
		ctx.lineTo(this.pos.x - camera.x, this.pos.y - camera.y);
		ctx.stroke();
	};
	Grapple.prototype.jump = function(dirX, dirY) {
		if(arguments.length === 1) {
			dirY = dirX.y;
			dirX = dirX.x;
		}
		else if(arguments.length === 0) {
			dirX = 0;
			dirY = -1;
		}
		this.applyInstantaneousForce(15000, dirX, dirY);
		this._jumpingWhenPossible = false;
	};
	Grapple.prototype.jumpWhenPossible = function() {
		this._jumpingWhenPossible = true;	
	};
	return Grapple;
});