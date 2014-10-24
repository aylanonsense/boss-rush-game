if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/MailProjectile',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	MailProjectile,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('PLAYER');
	var GROUND_MOVEMENT = { ACC: { LESS: -60, DEFAULT: -30, MORE: 30 }, TOP_SPEED: 235 };
	var AIR_MOVEMENT = GROUND_MOVEMENT;
	var GRAVITY = 20;
	var JUMP_SPEED = 600;
	var STOP_JUMP_SPEED = 125;
	var MAX_VERTICAL_SPEED = Math.max(JUMP_SPEED, 600);
	function Player(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.setMoveDir(0, 0);
		this._framesOfAutoJump = 0;
		this._isJumping = false;
		this._isStanding = false;
		this._autoFire = false;
		this._facing = 1;
		this._framesOfLandingAnimation = 0;
		this._framesUntilAbleToFire = 0;
		this._currentAnimation = null;
		this._currentAnimationProgress = 0;
		this._isBeingHurt = false;
		this._invincibilityFramesLeft = 0;
	}
	Player.prototype = Object.create(SUPERCLASS.prototype);
	Player.prototype._setAnimation = function(anim) {
		if(this._currentAnimation !== anim) {
			this._currentAnimation = anim;
			this._currentAnimationProgress = 0;
		}
	};
	Player.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);

		//handle movement
		if(!this._isBeingHurt) {
			var MOVEMENT = (this._isStanding ? GROUND_MOVEMENT : AIR_MOVEMENT);
			if(this.vel.x > 0) {
				if(this._moveDir > 0) { this.vel.x += MOVEMENT.ACC.MORE; }
				else if(this._moveDir < 0) { this.vel.x += MOVEMENT.ACC.LESS; }
				else { this.vel.x += MOVEMENT.ACC.DEFAULT; }
				if(this.vel.x < 0) {
					this.vel.x = (this._moveDir < 0 ? this.vel.x : 0);
				}
			}
			else if(this.vel.x < 0) {
				if(this._moveDir > 0) { this.vel.x -= MOVEMENT.ACC.LESS; }
				else if(this._moveDir < 0) { this.vel.x -= MOVEMENT.ACC.MORE; }
				else { this.vel.x -= MOVEMENT.ACC.DEFAULT; }
				if(this.vel.x > 0) {
					this.vel.x = (this._moveDir > 0 ? this.vel.x : 0);
				}
			}
			else {
				if(this._moveDir > 0) { this.vel.x = MOVEMENT.ACC.MORE; }
				else if(this._moveDir < 0) { this.vel.x = -MOVEMENT.ACC.MORE; }
			}
			if(this.vel.x > MOVEMENT.TOP_SPEED) { this.vel.x = MOVEMENT.TOP_SPEED; }
			else if(this.vel.x < -MOVEMENT.TOP_SPEED) { this.vel.x = -MOVEMENT.TOP_SPEED; }
			if(this.vel.x < 0 && this._isStanding) { this._facing = -1; }
			else if(this.vel.x > 0 && this._isStanding) { this._facing = 1; }
			else if(!this._isStanding && this._moveDir !== 0) { this._facing = this._moveDir; }
			this.vel.y += GRAVITY;
			if(this.vel.y < -MAX_VERTICAL_SPEED) { this.vel.y = -MAX_VERTICAL_SPEED; }
			else if(this.vel.y > MAX_VERTICAL_SPEED) { this.vel.y = MAX_VERTICAL_SPEED; }
		}

		//handle jumping
		this._framesOfLandingAnimation--;
		this._framesOfAutoJump--;
		if(this.vel.y > 0) {
			this._isJumping = false;
		}
		this._bottomCollisionsThisFrame = 0;
		this._invincibilityFramesLeft--;
		if(this._invincibilityFramesLeft <= 85) {
			this._isBeingHurt = false;
		}

		//handle firing
		this._framesUntilAbleToFire--;
		if(!this._isBeingHurt && this._framesUntilAbleToFire <= 0 && this._autoFire) {
			this.fireProjectile();
		}
	};
	Player.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			this._currentAnimationProgress++;
			if(this._isBeingHurt) {
				frame = (this._invincibilityFramesLeft % 16 > 7 ? 53 : 54);
			}
			else if(this._isStanding) {
				if(this.vel.x === 0) {
					if(this._framesOfLandingAnimation > 0) {
						this._setAnimation('landing');
						frame = 62;
					}
					else {
						this._setAnimation('standing');
						frame = 0;
					}
				}
				else {
					this._framesOfLandingAnimation = 0;
					if(this._moveDir === 0) {
						frame = 40;
					}
					else if(this._moveDir < 0 !== this.vel.x < 0) {
						frame = 51;
					}
					else {
						this._setAnimation('running');
						var p = (this._currentAnimationProgress % 40);
						if(p < 11) { frame = 20; }
						else if(p < 20) { frame = 21; }
						else if(p < 31) { frame = 22; }
						else { frame = 23; }
					}
				}
			}
			else {
				this._setAnimation('airborne');
				frame = 17;
				if(this.vel.x * this.vel.x + this.vel.y * this.vel.y > 250 * 250) {
					var angle = (Math.atan2(this.vel.y, this.vel.x) + 2 * Math.PI) % (2 * Math.PI);
					if(Math.PI * 1 / 8 < angle && angle < Math.PI * 7 / 8) {
						//moving downward
						frame += 10;
					}
					else if(Math.PI * 9 / 8 < angle && angle < Math.PI * 15 / 8) {
						//moving upward
						frame -= 10;
					}
					if(Math.PI * 5 / 8 < angle && angle < Math.PI * 11 / 8) {
						//moving left
						frame += (this._facing > 0 ? -1 : 1);
					}
					else if(angle < Math.PI * 3 / 8 || Math.PI * 13 / 8 < angle) {
						//moving right
						frame += (this._facing > 0 ? 1 : -1);
					}
				}
			}
			if(this._isBeingHurt || this._invincibilityFramesLeft <= 0 || this._invincibilityFramesLeft % 15 < 10) {
				SPRITE.render(ctx, camera, this.pos.x - 10, this.pos.y - 10, frame, this._facing < 0);
			}
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	Player.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 28, 36);
	};
	Player.prototype._recalculateHitBoxes = function() {
		this._hitboxes = [
			new Hitbox({ type: 'player', shape: new Rect(this.pos.x + 2, this.pos.y + 2, 24, 32) })
		];
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	Player.prototype.finishMovement = function() {
		SUPERCLASS.prototype.finishMovement.apply(this, arguments);
		if(this._bottomCollisionsThisFrame === 0) {
			this._isStanding = false;
		}
	};
	Player.prototype._onCollided = function(thing, dir) {
		if(dir === 'bottom') {
			this._bottomCollisionsThisFrame++;
			this._isStanding = true;
			this._isJumping = false;
			if(this._framesOfAutoJump > 0) {
				//jump!
				this._framesOfAutoJump = 0;
				this.vel.y = -JUMP_SPEED;
				this._isJumping = true;
				this._isStanding = false;
			}
			else if(this.vel.x === 0 && this.vel.y > 375) {
				this._framesOfLandingAnimation = Math.floor(this.vel.y / 25) - 10;
			}
			if(this.vel.y > 0) {
				this.vel.y = 0;
			}
		}
		else if(dir === 'left') {
			if(this.vel.x < 0) {
				this.vel.x = 0;
			}
		}
		else if(dir === 'right') {
			if(this.vel.x > 0) {
				this.vel.x = 0;
			}
		}
	};
	Player.prototype.setMoveDir = function(xDir) {
		this._moveDir = xDir;
	};
	Player.prototype.jump = function() {
		this._framesOfAutoJump = 5;
	};
	Player.prototype.stopJumping = function() {
		if(this._isJumping && this.vel.y < -STOP_JUMP_SPEED) {
			this.vel.y = -STOP_JUMP_SPEED;
		}
	};
	Player.prototype.fireProjectile = function() {
		if(this._framesUntilAbleToFire <= 0) {
			this._framesUntilAbleToFire = 10;
			this.level.spawnActor(new MailProjectile(this.level, this.pos.x + 14 + 14 * this._facing, this.pos.y + 12, this._facing));
			this._autoFire = false;
		}
		else if(this._framesUntilAbleToFire <= 6) {
			this._autoFire = true;
		}
	};
	Player.prototype.hurt = function() {
		if(!this._isBeingHurt && this._invincibilityFramesLeft <= 0) {
			this._isBeingHurt = true;
			this._invincibilityFramesLeft = 115;
			this.vel.y = 0;
			this.vel.x = -100 * this._facing;
		}
	};
	return Player;
});