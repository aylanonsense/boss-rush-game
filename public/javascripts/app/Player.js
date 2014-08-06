if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils'
], function(
	GeometryUtils
) {
	function Player(x, y) {
		this.width = 50;
		this.height = 50;
		this.pos = { x: x, y: y };
		this.pos.prev = { x: x, y: y };
		this.vel = { x: 0, y: 0 };
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };
		this._durationOfMovement = 0;
		this._recalculateMovementVectors();
	}
	Player.prototype.move = function(ms) {
		var t = ms / 1000;
		var u = 1 / 60; //constant time t

		//apply velocity to position
		var oldVel = { x: this.vel.x, y: this.vel.y };
		this.vel.x += this._forceThisFrame.x * t + this._forceThisFrame.instant.x * u;
		this.vel.y += this._forceThisFrame.y * t + this._forceThisFrame.instant.y * u;
		this.pos.prev.x = this.pos.x;
		this.pos.prev.y = this.pos.y;
		//averaging allows the velocity's effect on position to be framerate-independent
		this.pos.x += (this.vel.x + oldVel.x) / 2 * t;
		this.pos.y += (this.vel.y + oldVel.y) / 2 * t;

		//reset forces
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };

		//calculate the line of movement
		this._durationOfMovement = ms;
		this._recalculateMovementVectors();
	};
	Player.prototype._rewindMovementTo = function(x, y) {
		//determine how long of a rewind this is
		var dx = this.pos.x - x;
		var dy = this.pos.y - y;
		var distRewind = Math.sqrt(dx * dx + dy * dy);
		var p = (this.lineOfMovement.dist === 0 ? 0 : distRewind / this.lineOfMovement.dist);
		var rewindDuration = this._durationOfMovement * p;
		this._durationOfMovement -= rewindDuration;

		//apply rewind to player's position
		this.pos.x = x;
		this.pos.y = y;
		this._recalculateMovementVectors();

		//return how many ms were undone due to rewinding
		return rewindDuration;
	};
	Player.prototype.handleInterruption = function(interruption) {
		//rewind movement to just before the interruption
		var msRemaining = this._rewindMovementTo(interruption.x, interruption.y);

		//apply any changes due to the interruption
		interruption.handle();

		//replay the remaining time
		this.move(msRemaining);
	};
	Player.prototype.interruptRemainingMovement = function() {
		this.pos.x = this.pos.prev.x;
		this.pos.y = this.pos.prev.y;
		this.vel.x = 0;
		this.vel.y = 0;
		this._recalculateMovementVectors();
	};
	Player.prototype._recalculateMovementVectors = function() {
		var w = this.width / 2, h = this.height / 2;
		var start = this.pos.prev;
		var end = this.pos;

		//project movement vector from center of player's bounding box
		this.lineOfMovement = GeometryUtils.toLine(start, end);

		//project movement vector from all four corners of the player's bound box
		this.collisionLines = [];
		this.collisionLines.push(GeometryUtils.toLine(start.x + w, start.y + h, end.x + w, end.y + h));
		this.collisionLines.push(GeometryUtils.toLine(start.x - w, start.y + h, end.x - w, end.y + h));
		this.collisionLines.push(GeometryUtils.toLine(start.x + w, start.y - h, end.x + w, end.y - h));
		this.collisionLines.push(GeometryUtils.toLine(start.x - w, start.y - h, end.x - w, end.y - h));

		//create line along the two bounding box edges in the direction of movement
		this.leadingLeftOrRightEdge = null;
		if(start.x !== end.x) {
			this.leadingLeftOrRightEdge = GeometryUtils.toLine(start.x + (start.x < end.x ? w : -w), start.y + h,
				start.x + (start.x < end.x ? w : -w), start.y - h);
		}
		this.leadingTopOrBottomEdge = null;
		if(start.y !== end.y) {
			this.leadingTopOrBottomEdge = GeometryUtils.toLine(start.x + w, start.y + (start.y < end.y ? h : -h),
				start.x - w, start.y + (start.y < end.y ? h : -h));
		}
	};
	Player.prototype.applyForce = function(forceX, forceY) { //or (force, dirX, dirY)
		if(arguments.length === 3) {
			var force = arguments[0];
			var dirX = arguments[1];
			var dirY = arguments[2];
			var totalDir = Math.sqrt(dirX * dirX + dirY * dirY);
			this._forceThisFrame.x += force * dirX / totalDir;
			this._forceThisFrame.y += force * dirY / totalDir;
		}
		else {
			this._forceThisFrame.x += forceX;
			this._forceThisFrame.y += forceY;
		}
	};
	Player.prototype.applyInstantaneousForce = function(forceX, forceY) { //or (force, dirX, dirY)
		if(arguments.length === 3) {
			var force = arguments[0];
			var dirX = arguments[1];
			var dirY = arguments[2];
			var totalDir = Math.sqrt(dirX * dirX + dirY * dirY);
			this._forceThisFrame.instant.x += force * dirX / totalDir;
			this._forceThisFrame.instant.y += force * dirY / totalDir;
		}
		else {
			this._forceThisFrame.instant.x += forceX;
			this._forceThisFrame.instant.y += forceY;
		}
	};
	Player.prototype.render = function(ctx, camera) {
		ctx.fillStyle = '#fee';//'#f44';
		ctx.fillRect(this.pos.x - camera.x - this.width / 2,
			this.pos.y - camera.y - this.height / 2, this.width, this.height);

		//debug -- draw collidable corners
		ctx.fillStyle = '#000';
		for(var i = 0; i < this.collisionLines.length; i++) {
			var line = this.collisionLines[i];
			ctx.beginPath();
			ctx.arc(line.end.x - camera.x, line.end.y - camera.y, 1.5, 0, 2 * Math.PI, false);
			ctx.fill();
		}
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 1;
		if(this.leadingTopOrBottomEdge) {
			ctx.beginPath();
			ctx.moveTo(this.leadingTopOrBottomEdge.start.x - camera.x, this.leadingTopOrBottomEdge.start.y - camera.y);
			ctx.lineTo(this.leadingTopOrBottomEdge.end.x - camera.x, this.leadingTopOrBottomEdge.end.y - camera.y);
			ctx.stroke();
		}
		if(this.leadingLeftOrRightEdge) {
			ctx.beginPath();
			ctx.moveTo(this.leadingLeftOrRightEdge.start.x - camera.x, this.leadingLeftOrRightEdge.start.y - camera.y);
			ctx.lineTo(this.leadingLeftOrRightEdge.end.x - camera.x, this.leadingLeftOrRightEdge.end.y - camera.y);
			ctx.stroke();
		}
	};
	Player.prototype.jump = function(dirX, dirY) {
		if(arguments.length === 1) {
			dirY = dirX.y;
			dirX = dirX.x;
		}
		else if(arguments.length === 0) {
			dirX = 0;
			dirY = -1;
		}
		this.applyInstantaneousForce(15000, dirX, dirY);
	};
	return Player;
});