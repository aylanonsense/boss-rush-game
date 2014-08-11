if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils',
	'app/SpriteSheet'
], function(
	GeometryUtils,
	SpriteSheet
) {
	//variables to control how the player moves
	var MAX_WALK_SPEED = 250;
	var WALK_ACC = 20;
	var WALK_ACC_INITIAL = 40;
	var WALK_DEC = 10;
	var WALK_DEC_ENHANCED = 20;
	var SKID_DEC = 2; //must be less than MAX_WALK_SPEED
	var SKID_DEC_SUPPRESSED = 0;
	var SKID_DEC_ENHANCED = 4;
	//same variables for air
	var MAX_AIR_SPEED = 500;
	var AIR_ACC = 2.5;
	var AIR_ACC_INITIAL = 50;
	var AIR_DEC = 0.5;
	var AIR_DEC_ENHANCED = 2;
	var DRAG_DEC = 1;
	var DRAG_DEC_SUPPRESSED = 0;
	var DRAG_DEC_ENHANCED = 2;
	//some extra for jumping/falling
	var FALL_ACC = 20;
	var JUMP_SPEED = 600;
	var JUMP_STOP_SPEED = 200;
	var MAX_FALL_SPEED = 1000;
	var MAX_RISE_SPEED = 1000;
	function Player(x, y) {
		this.width = 33;
		this.height = 54;
		this.pos = { x: x, y: y }; //the upper left point of the player
		this.pos.prev = { x: x, y: y };
		this.vel = { x: 0, y: 0 };
		this._forceThisFrame = { x: 0, y: 0 };
		this._forceThisFrame.instant = { x: 0, y: 0 };
		this._recalculateCollisionBoxes();
		this._isTryingToJump = false;
		this._isAirborne = true;
		this._spriteOffset = { x: -24, y: -15 };
		this._sprite = new SpriteSheet('/image/mailman-spritesheet.gif', 3, 24, 24);
		this._runAnimation = 0;
		this._skidAnimation = 0;
		this._facing = 1;
	}
	Player.prototype._recalculateCollisionBoxes = function() {
		var w = this.width, h = this.height;
		var m = 7; //how inset the vertical detectors are
		var p = 9; //how inset the horizontal detectors are
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
				self._recalculateCollisionBoxes();
			}
			if(GeometryUtils.areRectsColliding(self._bottomBox, tile.box)) {
				self.vel.y = 0;
				self.pos.y = tile.box.y - self.height;
				self._recalculateCollisionBoxes();
				self._isAirborne = false;
				if(self._isTryingToJump) {
					self._isTryingToJump = false;
					self.vel.y = -JUMP_SPEED;
				}
			}
			if(GeometryUtils.areRectsColliding(self._leftBox, tile.box)) {
				self.vel.x = 0;
				self.pos.x = tile.box.x + tile.box.width;
				self._recalculateCollisionBoxes();
			}
			if(GeometryUtils.areRectsColliding(self._rightBox, tile.box)) {
				self.vel.x = 0;
				self.pos.x = tile.box.x - self.width;
				self._recalculateCollisionBoxes();
			}
		});
		self._isTryingToJump = false;
	};
	Player.prototype.tick = function(ms) {
		this.move(ms);
		this._isAirborne = true;
	};
	Player.prototype.move = function(ms) {
		var u = 1 / 60; //constant time t
		var t = u; //ms / 1000;

		this.vel.y += FALL_ACC;
		if(this.vel.y > MAX_FALL_SPEED) {
			this.vel.y = MAX_FALL_SPEED;
		}
		if(this.vel.y < -MAX_RISE_SPEED) {
			this.vel.y = -MAX_RISE_SPEED;
		}

		if(this._isAirborne) {
			//just starting to move
			if(this.vel.x === 0) {
				//you start moving with a certain velocity
				if(this._moveDir.x !== 0) {
					this.vel.x = this._moveDir.x * AIR_ACC_INITIAL;
					this._facing = this._moveDir.x;
				}
			}
			//already moving and not pressing anything
			else if(this._moveDir.x === 0) {
				//if you're moving really fast, you skid, which doesn't slow you down very quickly
				if(Math.abs(this.vel.x) > MAX_AIR_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * DRAG_DEC;
				}
				//if you're moving slow enough you just stop
				else if(Math.abs(this.vel.x) < AIR_DEC) {
					this.vel.x = 0;
				}
				//otherwise you slow down
				else {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * AIR_DEC;
				}
			}
			//already moving and pressing in opposite direction of movement
			else if((this.vel.x >= 0) !== (this._moveDir.x >= 0)) {
				//if you're moving really fast, you skid, which doesn't slow you down very quickly
				if(Math.abs(this.vel.x) > MAX_AIR_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * DRAG_DEC_ENHANCED;
				}
				//if you're moving slow enough you switch directions
				else if(Math.abs(this.vel.x) < AIR_DEC_ENHANCED) {
					this.vel.x = this._moveDir.x * AIR_ACC_INITIAL;
					this._facing = this._moveDir.x;
				}
				//otherwise you slow down
				else {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * AIR_DEC_ENHANCED;
				}
			}
			//already moving and pressing in direction of movement
			else {
				//if you're moving really fast, you lose very little velocity
				if(Math.abs(this.vel.x) > MAX_AIR_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * DRAG_DEC_SUPPRESSED;
				}
				//if you're close enough then you reach the max movespeed
				else if(this.vel.x > 0 && this.vel.x + AIR_ACC >= MAX_AIR_SPEED) {
					this.vel.x = MAX_AIR_SPEED;
				}
				else if(this.vel.x < 0 && this.vel.x - AIR_ACC <= -MAX_AIR_SPEED) {
					this.vel.x = -MAX_AIR_SPEED;
				}
				//otherwise you speed up
				else {
					this.vel.x += (this.vel.x > 0 ? 1 : -1) * AIR_ACC;
				}
			}
		}
		else {
			//just starting to move
			if(this.vel.x === 0) {
				//you start moving with a certain velocity
				if(this._moveDir.x !== 0) {
					this.vel.x = this._moveDir.x * WALK_ACC_INITIAL;
					this._facing = this._moveDir.x;
				}
			}
			//already moving and not pressing anything
			else if(this._moveDir.x === 0) {
				//if you're moving really fast, you skid, which doesn't slow you down very quickly
				if(Math.abs(this.vel.x) > MAX_WALK_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * SKID_DEC;
				}
				//if you're moving slow enough you just stop
				else if(Math.abs(this.vel.x) < WALK_DEC) {
					this.vel.x = 0;
				}
				//otherwise you slow down
				else {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * WALK_DEC;
				}
			}
			//already moving and pressing in opposite direction of movement
			else if((this.vel.x >= 0) !== (this._moveDir.x >= 0)) {
				//if you're moving really fast, you skid, which doesn't slow you down very quickly
				if(Math.abs(this.vel.x) > MAX_WALK_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * SKID_DEC_ENHANCED;
				}
				//if you're moving slow enough you switch directions
				else if(Math.abs(this.vel.x) < WALK_DEC_ENHANCED) {
					this.vel.x = this._moveDir.x * WALK_ACC_INITIAL;
					this._facing = this._moveDir.x;
				}
				//otherwise you slow down
				else {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * WALK_DEC_ENHANCED;
				}
			}
			//already moving and pressing in direction of movement
			else {
				//if you're moving really fast, you lose very little velocity
				if(Math.abs(this.vel.x) > MAX_WALK_SPEED) {
					this.vel.x -= (this.vel.x > 0 ? 1 : -1) * SKID_DEC_SUPPRESSED;
				}
				//if you're close enough then you reach the max movespeed
				else if(this.vel.x > 0 && this.vel.x + WALK_ACC >= MAX_WALK_SPEED) {
					this.vel.x = MAX_WALK_SPEED;
				}
				else if(this.vel.x < 0 && this.vel.x - WALK_ACC <= -MAX_WALK_SPEED) {
					this.vel.x = -MAX_WALK_SPEED;
				}
				//otherwise you speed up
				else {
					this.vel.x += (this.vel.x > 0 ? 1 : -1) * WALK_ACC;
				}
			}
		}

		//apply velocity to position
		this.vel.x += this._forceThisFrame.x * t + this._forceThisFrame.instant.x * u;
		this.vel.y += this._forceThisFrame.y * t + this._forceThisFrame.instant.y * u;
		this.pos.prev.x = this.pos.x;
		this.pos.prev.y = this.pos.y;
		this.pos.x += this.vel.x * t;
		this.pos.y += this.vel.y * t;

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
	Player.prototype.jump = function() {
		this._isTryingToJump = true;
	};
	Player.prototype.stopJumping = function() {
		if(this.vel.y < -JUMP_STOP_SPEED) {
			this.vel.y = -JUMP_STOP_SPEED;
		}
	}
	Player.prototype.setMoveDir = function(dirX, dirY) {
		this._moveDir = { x: dirX, y: dirY };
	};
	Player.prototype.render = function(ctx, camera) {
		var frame = 40;
		var flip = this._facing < 0;
		if(this._isAirborne) {
			if(this.vel.y > 600) {
				frame = 73;
			}
			else if(this.vel.y > 100) {
				frame = 72;
			}
			else if(this.vel.y > -300) {
				frame = 71;
			}
			else {
				frame = 70;
			}
		}
		else {
			if(this.vel.x === 0) {
				//standing animation
				this._runAnimation = 0;
				this._skidAnimation = 0;
			}
			else if(Math.abs(this.vel.x) > MAX_WALK_SPEED) {
				//normal skid animation
				if(this._moveDir.x === 0) {
					frame = 50;
					this._skidAnimation = 0;
					this._runAnimation = 0;
				}
				//run animation
				else if((this._moveDir.x > 0) === (this.vel.x > 0)) {
					this._skidAnimation = 0;
					this._runAnimation += Math.abs(this.vel.x / 600);
					if(this._runAnimation < 5) {
						frame = 60;
					}
					else if(this._runAnimation < 10) {
						frame = 61;
					}
					else if(this._runAnimation < 15) {
						frame = 62;
					}
					else if(this._runAnimation < 20) {
						frame = 63;
					}
					else {
						this._runAnimation = 0;
						frame = 60;
					}
				}
				//extra skid animation
				else {
					this._runAnimation = 0;
					this._skidAnimation += 1;
					if(this._skidAnimation > 16) {
						this._skidAnimation = 0;
					}
					frame = this._skidAnimation > 8 ? 52 : 53;
				}
			}
			else if(Math.abs(this.vel.x) <= MAX_WALK_SPEED && this._moveDir.x !== 0 && (this._moveDir.x > 0) !== (this.vel.x > 0)) {
				frame = 51;
				this._runAnimation = 0;
				this._skidAnimation = 0;
			}
			else {
				//running animation
				this._runAnimation += Math.abs(this.vel.x / 600);
				if(this._runAnimation < 6) {
					frame = 41;
				}
				else if(this._runAnimation < 10) {
					frame = 42;
				}
				else if(this._runAnimation < 16) {
					frame = 43;
				}
				else if(this._runAnimation < 20) {
					frame = 42;
				}
				else {
					this._runAnimation = 0;
					this._skidAnimation = 0;
					frame = 41;
				}
			}
		}
		this._sprite.render(ctx, camera, this.pos.x + this._spriteOffset.x, this.pos.y + this._spriteOffset.y, frame, flip);
		/*ctx.fillStyle = this._isAirborne ? '#fbb' : '#bef';
		ctx.fillRect(this.pos.x - camera.x, this.pos.y - camera.y, this.width, this.height);
		ctx.fillStyle = '#000';
		ctx.font = "10px Arial";
		ctx.fillText("" + Math.round(this.vel.x), this.pos.x + 2 - camera.x, this.pos.y + 32 - camera.y);
		ctx.fillStyle = '#00f';
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