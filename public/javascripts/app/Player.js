if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/GeometryUtils',
	'app/Grapple',
	'app/SpriteSheet'
], function(
	GeometryUtils,
	Grapple,
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
	//and wallcling jumping
	var WALLCLING_JUMP_SPEED = { x: 300, y: 475 };
	var WALLCLING_JUMP_SPEED_SUPPRESSED = { x: 75, y: 500 };
	var WALLCLING_JUMP_SPEED_ENHANCED = { x: 350, y: 300 };
	var WALLCLING_DROP_SPEED = { x: 50, y: 0 };
	var WALLCLING_DURATION = 18;
	var WALLCLING_SLIDE_ACC = 2;
	var WALLCLING_SLIDE_ACC_SUPRESSED = 2;
	var WALLCLING_SLIDE_ACC_ENHANCED = 20;
	var WALLCLING_SLIDE_DEC = 50;
	var WALLCLING_SLIDE_SPEED = 200;
	var WALLCLING_SLIDE_SPEED_SUPRESSED = 125;
	var WALLCLING_SLIDE_SPEED_ENHANCED = 1000;
	var WALLCLING_OVERRIDE_SPEED = 1000;
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
		this._spriteOffset = { x: -21, y: -15 };
		this._sprite = new SpriteSheet('/image/mailman-spritesheet.gif', 3, 24, 24);
		this._facing = 1;
		this._wallClinging = false;
		this._beganWallClingSliding = false;
		this._framesSpentWallClinging = 0;
		this.grappleOffset = { x: 16.5, y: 28 };
		this._currAnimation = null;
		this._currAnimationTime = 0;
	}
	Player.prototype._recalculateCollisionBoxes = function() {
		var w = this.width, h = this.height;
		var m = 7; //how inset the vertical detectors are
		var p = 9; //how inset the horizontal detectors are
		var q = 24; //how inset the horizontal cling detectors are
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
		this._leftClingBox = {
			x: this.pos.x - 1,
			y: this.pos.y + q,
			width: w / 2 + 1,
			height: h - 2 * q
		};
		this._rightClingBox = {
			x: this.pos.x + w / 2,
			y: this.pos.y + q,
			width: w / 2 + 1,
			height: h - 2 * q
		};
	};
	Player.prototype.checkForCollisions = function(tiles) {
		var self = this;
		tiles.forEach(function(tile) {
			if(GeometryUtils.areRectsColliding(self._topBox, tile.box)) {
				self.vel.y = 0;
				self.pos.y = tile.box.y + tile.box.height;
				if(self._wallClinging) {
					self._facing *= -1;
					self._wallClinging = false;
				}
				self._recalculateCollisionBoxes();
			}
			if(GeometryUtils.areRectsColliding(self._bottomBox, tile.box)) {
				self.vel.y = 0;
				self.pos.y = tile.box.y - self.height;
				if(self._wallClinging) {
					self._facing *= -1;
					self._wallClinging = false;
				}
				self._recalculateCollisionBoxes();
				self._isAirborne = false;
				if(self._isTryingToJump) {
					self._isTryingToJump = false;
					self.vel.y = -JUMP_SPEED;
				}
			}
		});
		var keepWallClinging = false;
		tiles.forEach(function(tile) {
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
			if(!self._wallClinging && self.vel.y > -300 && self._isAirborne) {
				if(self._facing === -1 && GeometryUtils.areRectsColliding(self._leftClingBox, tile.box)) {
					self._wallClinging = true;
					self._framesSpentWallClinging = 0;
					self._beganWallClingSliding = self._moveDir.y === 1 || (self.vel.y >= WALLCLING_OVERRIDE_SPEED);
					keepWallClinging = true;
				}
				if(self._facing === 1 &&GeometryUtils.areRectsColliding(self._rightClingBox, tile.box)) {
					self._wallClinging = true;
					self._framesSpentWallClinging = 0;
					self._beganWallClingSliding = self._moveDir.y === 1 || (self.vel.y >= WALLCLING_OVERRIDE_SPEED);
					keepWallClinging = true;
				}
			}
			else if(self._wallClinging) {
				if(self._facing === -1 && GeometryUtils.areRectsColliding(self._leftClingBox, tile.box)) {
					keepWallClinging = true;
				}
				if(self._facing === 1 &&GeometryUtils.areRectsColliding(self._rightClingBox, tile.box)) {
					keepWallClinging = true;
				}
			}
		});
		if(this._wallClinging && !keepWallClinging) {
			this._wallClinging = false;
			this._facing *= -1;
		}
		this._isTryingToJump = false;
	};
	Player.prototype.tick = function(ms) {
		this.move(ms);
		this._isAirborne = true;
	};
	Player.prototype.move = function(ms) {
		var u = 1 / 60; //constant time t
		var t = u; //ms / 1000;

		if(this._wallClinging) {
			if(this._isTryingToJump) {
				this._facing *= -1;
				if(this._moveDir.y === 1) {
					//drop
					this.vel.x = this._facing * WALLCLING_DROP_SPEED.x;
					this.vel.y = WALLCLING_DROP_SPEED.y;
				}
				else if(this._moveDir.y === -1 || (this._moveDir.x !== 0 && this._moveDir.x !== this._facing)) {
					this.vel.x = this._facing * WALLCLING_JUMP_SPEED_SUPPRESSED.x;
					this.vel.y = -WALLCLING_JUMP_SPEED_SUPPRESSED.y;
				}
				else if(this._moveDir.x === 0) {
					this.vel.x = this._facing * WALLCLING_JUMP_SPEED.x;
					this.vel.y = -WALLCLING_JUMP_SPEED.y;
				}
				else {
					this.vel.x = this._facing * WALLCLING_JUMP_SPEED_ENHANCED.x;
					this.vel.y = -WALLCLING_JUMP_SPEED_ENHANCED.y;
				}
				this._isTryingToJump = false;
				this._wallClinging = false;
			}
			//after a while of clinging
			else if(this._framesSpentWallClinging >= WALLCLING_DURATION || this._beganWallClingSliding || this._moveDir.y === 1) {
				//if we aren't sliding down fast enough, accelerate
				var speed = (this._moveDir.y === -1 ? WALLCLING_SLIDE_SPEED_SUPRESSED : (this._moveDir.y === 1 ? WALLCLING_SLIDE_SPEED_ENHANCED : WALLCLING_SLIDE_SPEED));
				var acc = (this._moveDir.y === -1 ? WALLCLING_SLIDE_ACC_SUPRESSED : (this._moveDir.y === 1 ? WALLCLING_SLIDE_ACC_ENHANCED : WALLCLING_SLIDE_ACC));
				var dec = WALLCLING_SLIDE_DEC;
				if(this.vel.y < speed) {
					this.vel.y += acc;
					if(this.vel.y > speed) {
						this.vel.y = speed;
					}
				}
				//if we're sliding down too fast, decelerate
				else if(this.vel.y > speed) {
					this.vel.y -= dec;
					if(this.vel.y < speed) {
						this.vel.y = speed;
					}
				}
			}
			//for the first split second after clinging
			else {
				//slow down to a stop
				this.vel.y -= WALLCLING_SLIDE_DEC;
				if(this.vel.y < 0) {
					this.vel.y = 0;
				}
				if(this.vel.y === 0) {
					this._framesSpentWallClinging++;
				}
			}
		}
		else {
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
	Player.prototype.shootGrapple = function(x, y) {
		var dirX = x - this.pos.x - this.grappleOffset.x;
		var dirY = y - this.pos.y - this.grappleOffset.y;
		return new Grapple(this, dirX, dirY);
	};
	Player.prototype.jump = function() {
		this._isTryingToJump = true;
	};
	Player.prototype.stopJumping = function() {
		if(this.vel.y < -JUMP_STOP_SPEED) {
			this.vel.y = -JUMP_STOP_SPEED;
		}
	};
	Player.prototype.setMoveDir = function(dirX, dirY) {
		this._moveDir = { x: dirX, y: dirY };
	};
	Player.prototype._setAnimation = function(anim) {
		if(this._currAnimation !== anim) {
			this._currAnimation = anim;
			this._currAnimationTime	= 0;
		}
	};
	Player.prototype.render = function(ctx, camera) {
		var frame, flip = this._facing < 0;
		var speed = this.vel.x < 0 ? -this.vel.x : this.vel.x;

		//wallclinging only has one animation
		if(this._wallClinging) {
			this._setAnimation('clinging');
			frame = 82; //clinging to the wall
		}

		//while airborne, frame is just determined by vertical velocity
		else if(this._isAirborne) {
			this._setAnimation('jumping');
			if(this.vel.y > 600) {
				frame = 73; //moving downward really fast
			}
			else if(this.vel.y > 100) {
				frame = 72; //moving downward
			}
			else if(this.vel.y > -300) {
				frame = 71; //moving upward
			}
			else {
				frame = 70; //moving upward really fast
			}
		}

		//there's a lot of different stuff that could be happening on the ground
		else {
			//if standing still
			if(speed === 0) {
				this._setAnimation('standing');
				if(this._moveDir.y === 1) {
					frame = 80; //crouching
				}
				else if(this._moveDir.y === -1) {
					frame = 40; //TODO looking up
				}
				else {
					frame = 40; //just standing
				}
			}

			//if moving faster than the max walk speed
			else if(speed > MAX_WALK_SPEED) {
				//normal skid animation when not pressing a direction
				if(this._moveDir.x === 0) {
					this._setAnimation('skidding');
					frame = 50; //skidding
				}

				//if pressing in the direction of movement, a multi-frame run animation is played
				else if((this._moveDir.x > 0) === (this.vel.x > 0)) {
					this._setAnimation('running');
					this._currAnimationTime = (this._currAnimationTime + speed / 600) % 20;
					if(this._currAnimationTime < 5) {
						frame = 60; //run 1
					}
					else if(this._currAnimationTime < 10) {
						frame = 61; //run 2
					}
					else if(this._currAnimationTime < 15) {
						frame = 62; //run 3
					}
					else {
						frame = 63; //run 4
					}
				}

				//if pressing the the direction opposite of movement, a multi-frame super skid animation is played
				else {
					this._setAnimation('super skidding');
					this._currAnimationTime = (this._currAnimationTime + 1) % 16;
					frame = this._skidAnimation > 8 ? 52 : 53; //super-skid 1 / super-skid 2
				}
			}

			//if walking (at or below the max walk speed)
			else {
				//if pressing in the direction opposite movement, display a turning animation
				if((this._moveDir.x > 0 && this.vel.x < 0) || (this._moveDir.x < 0 && this.vel.x > 0)) {
					this._setAnimation('turning');
					frame = 51; //turning
				}

				//otherwise display a multi-frame walking animation
				else {
					this._setAnimation('walking');
					this._currAnimationTime = (this._currAnimationTime + speed / 600) % 20;
					console.log(this._currAnimationTime);
					if(this._currAnimationTime < 6) {
						frame = 41; //walk 1
					}
					else if(this._currAnimationTime < 10) {
						frame = 42; //walk 2
					}
					else if(this._currAnimationTime < 16) {
						frame = 43; //walk 3
					}
					else {
						frame = 42; //walk 2 (repeated)
					}
				}
			}
		}
		this._sprite.render(ctx, camera, this.pos.x + this._spriteOffset.x, this.pos.y + this._spriteOffset.y, frame, flip);
	};
	return Player;
});