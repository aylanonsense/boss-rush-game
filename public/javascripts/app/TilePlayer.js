if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils'
], function(
	GeometryUtils
) {
	var MIN_VELOCITY = 0.00000001;
	function Player(x, y) {
		this.width = 26;
		this.height = 36;
		this.pos = { x: x, y: y }; //the upper left point of the player
		this.pos.prev = { x: x, y: y };
		this.vel = { x: 0, y: 0 };
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };
		this._recalculateCollisionBoxes();
	}
	Player.prototype._recalculateCollisionBoxes = function() {
		var w = this.width, h = this.height;
		var m = 5; //how inset the vertical detectors are
		var p = 6; //how inset the horizontal detectors are
		this._topBox = {
			x: this.pos.x + m,
			y: this.pos.y,
			width: w - 2 * m,
			height: h / 2
		};
		this._bottomBox = {
			x: this.pos.x + m,
			y: this.pos.y + h / 2,
			width: w - 2 * m,
			height: h / 2
		};
		this._leftBox = {
			x: this.pos.x,
			y: this.pos.y + p,
			width: w / 2,
			height: h - 2 * p
		};
		this._rightBox = {
			x: this.pos.x + w / 2,
			y: this.pos.y + p,
			width: w / 2,
			height: h - 2 * p
		};
	};
	Player.prototype.checkForCollisions = function(tiles) {
		var self = this;
		tiles.forEach(function(tile) {
			if(GeometryUtils.areRectsColliding(self._topBox, tile.box)) {
				self.vel.y = 0;
				self.pos.y = tile.box.y + tile.box.height;
				self._recalculateCollisionBoxes()
			}
			if(GeometryUtils.areRectsColliding(self._bottomBox, tile.box)) {
				self.vel.y = 0;
				self.pos.y = tile.box.y - self.height;
				self._recalculateCollisionBoxes()
			}
			if(GeometryUtils.areRectsColliding(self._leftBox, tile.box)) {
				self.vel.x = 0;
				self.pos.x = tile.box.x + tile.box.width;
				self._recalculateCollisionBoxes()
			}
			if(GeometryUtils.areRectsColliding(self._rightBox, tile.box)) {
				self.vel.x = 0;
				self.pos.x = tile.box.x - self.width;
				self._recalculateCollisionBoxes()
			}
		});
	};
	Player.prototype.tick = function(ms) {
		this.move(ms);
	};
	Player.prototype.move = function(ms) {
		var t = ms / 1000;
		var u = 1 / 60; //constant time t

		//apply velocity to position
		var oldVel = { x: this.vel.x, y: this.vel.y };
		this.vel.x += this._forceThisFrame.x * t + this._forceThisFrame.instant.x * u;
		this.vel.y += this._forceThisFrame.y * t + this._forceThisFrame.instant.y * u;
		if(-MIN_VELOCITY <= this.vel.x && this.vel.x <= MIN_VELOCITY) {
			this.vel.x = 0;
		}
		if(-MIN_VELOCITY <= this.vel.y && this.vel.y <= MIN_VELOCITY) {
			this.vel.y = 0;
		}
		this.pos.prev.x = this.pos.x;
		this.pos.prev.y = this.pos.y;
		//averaging allows the velocity's effect on position to be framerate-independent
		this.pos.x += (this.vel.x + oldVel.x) / 2 * t;
		this.pos.y += (this.vel.y + oldVel.y) / 2 * t;

		//reset forces
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };

		this._recalculateCollisionBoxes();
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
		ctx.fillStyle = '#bef';
		ctx.fillRect(this.pos.x - camera.x, this.pos.y - camera.y, this.width, this.height);
		/*ctx.fillStyle = '#00f';
		ctx.fillRect(this._topBox.x - camera.x, this._topBox.y - camera.y, this._topBox.width, this._topBox.height);
		ctx.fillStyle = '#f00';
		ctx.fillRect(this._bottomBox.x - camera.x, this._bottomBox.y - camera.y, this._bottomBox.width, this._bottomBox.height);
		ctx.lineWidth = 2.5;
		ctx.strokeStyle = '#ff0';
		ctx.strokeRect(this._leftBox.x - camera.x, this._leftBox.y - camera.y, this._leftBox.width, this._leftBox.height);
		ctx.strokeStyle = '#0f0';
		ctx.strokeRect(this._rightBox.x - camera.x, this._rightBox.y - camera.y, this._rightBox.width, this._rightBox.height);*/
	};
	return Player;
});