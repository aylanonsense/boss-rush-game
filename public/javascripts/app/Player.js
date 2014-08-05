if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils'
], function(
	GeometryUtils
) {
	function Player(x, y) {
		this.pos = { x: x, y: y };
		this.pos.prev = { x: x, y: y };
		this.vel = { x: 0, y: 0 };
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };
		this._durationOfMovement = 0;
		this._recalculateMovementVectors();
		this.width = 20;
		this.height = 30;
		this._isTryingToJump = false;
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
	Player.prototype.handleInterruption = function(interruption) {
		//rewind movement to just before the interruption
		var msRemaining = this.rewindMovement(Math.sqrt(interruption.squareDistTo), true, interruption.x, interruption.y);
		if(this._isTryingToJump) { //TODO only do this with collisions
			this._isTryingToJump = false;
			this.jump();
		}

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
		this.lineOfMovement = GeometryUtils.toLine(this.pos.prev, this.pos);
		this.collisionLines = [];
		//if(this.pos.x > this.pos.prev.x || this.pos.y > this.pos.prev.y) { //moving right or down
	//}
	//if(this.pos.x < this.pos.prev.x || this.pos.y > this.pos.prev.y) { //moving left or down
	//}
	//if(this.pos.x > this.pos.prev.x || this.pos.y < this.pos.prev.y) { //moving right or up
	//}
	//if(this.pos.x < this.pos.prev.x || this.pos.y < this.pos.prev.y) { //moving left or up

	//}
		this.collisionLines.push(GeometryUtils.toLine(this.pos.prev.x + w, this.pos.prev.y + h,
			this.pos.x + w, this.pos.y + h)); //lower right corner of bounding box
		this.collisionLines.push(GeometryUtils.toLine(this.pos.prev.x - w, this.pos.prev.y + h,
			this.pos.x - w, this.pos.y + h)); //lower left corner of bounding box
		this.collisionLines.push(GeometryUtils.toLine(this.pos.prev.x + w, this.pos.prev.y - h,
			this.pos.x + w, this.pos.y - h)); //upper right corner of bounding box
		this.collisionLines.push(GeometryUtils.toLine(this.pos.prev.x - w, this.pos.prev.y - h,
			this.pos.x - w, this.pos.y - h)); //upper left corner of bounding box\
		if(this.pos.x > this.pos.prev.x) { //moving right, bound is on right side
			this._horizontalBoundIsLeft = false;
			this._horizontalBound = GeometryUtils.toLine(
				this.pos.prev.x + this.width / 2, this.pos.prev.y + this.height / 2,
				this.pos.prev.x + this.width / 2, this.pos.prev.y - this.height / 2);
		}
		else if(this.pos.x < this.pos.prev.x) { //moving left, bound is on left side
			this._horizontalBoundIsLeft = true;
			this._horizontalBound = GeometryUtils.toLine(
				this.pos.prev.x - this.width / 2, this.pos.prev.y + this.height / 2,
				this.pos.prev.x - this.width / 2, this.pos.prev.y - this.height / 2);
		}
		else { //not moving horizontally, no bound
			this._horizontalBound = null;
		}
		if(this.pos.y > this.pos.prev.y) { //moving down, bound is on bottom side
			this._verticalBoundIsTop = false;
			this._verticalBound = GeometryUtils.toLine(
				this.pos.prev.x + this.width / 2, this.pos.prev.y + this.height / 2,
				this.pos.prev.x - this.width / 2, this.pos.prev.y + this.height / 2);
		}
		else if(this.pos.y < this.pos.prev.y) { //moving up, bound is on top side
			this._verticalBoundIsTop = true;
			this._verticalBound = GeometryUtils.toLine(
				this.pos.prev.x + this.width / 2, this.pos.prev.y - this.height / 2,
				this.pos.prev.x - this.width / 2, this.pos.prev.y - this.height / 2);
		}
		else { //not moving horizontally, no bound
			this._verticalBound = null;
		}
	};
	Player.prototype.rewindMovement = function(distToRewind, isDistRemainingAfterRewind, x, y) {
		if((isDistRemainingAfterRewind ? this.lineOfMovement.dist - distToRewind : distToRewind) === 0) {
			return 0; //no rewind needs to be done
		}
		if(this.lineOfMovement.dist === 0) { throw new Error("Cannot rewind: player did not move any distance" +distToRewind); }
		if(this._durationOfMovement === 0) { throw new Error("Cannot rewind: player did not spend any time moving"); }
		if(distToRewind > this.lineOfMovement.dist) { throw new Error("Cannot rewind player further than distance moved: " + distToRewind + " > " + this.lineOfMovement.dist); }
		if(distToRewind < 0) { throw new Error("Cannot rewind player a negative distance"); }
		if(isDistRemainingAfterRewind) {
			distToRewind = this.lineOfMovement.dist - distToRewind;
		}
		var p = (distToRewind / this.lineOfMovement.dist);
		var rewindDuration = this._durationOfMovement * p;
		this.pos.x = x;//-= this.lineOfMovement.diff.x * p;
		this.pos.y = y;//-= this.lineOfMovement.diff.y * p;
		this._durationOfMovement -= rewindDuration;
		this._recalculateMovementVectors();
		return rewindDuration;
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
	Player.prototype.jumpWhenPossible = function() {
		this._isTryingToJump = true;
	};
	return Player;
});