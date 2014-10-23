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
	var GROUND_MOVEMENT = {
		ACC: { LESS: -80, DEFAULT: -30, MORE: 30 },
		TOP_SPEED: 225,
		INITIAL_SPEED: 30
	};
	var AIR_MOVEMENT = GROUND_MOVEMENT;
	var GRAVITY = 10;
	var JUMP_SPEED = 700;
	var STOP_JUMP_SPEED = 125;
	function Player(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.setMoveDir(0, 0);
		this._framesOfAutoJump = 0;
		this._isJumping = false;
		this._isStanding = false;
		this._autoFire = false;
		this._facing = 1;
		this._framesUntilAbleToFire = 0;
	}
	Player.prototype = Object.create(SUPERCLASS.prototype);
	Player.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);

		//handle movement
		var MOVEMENT = (this._isStanding ? GROUND_MOVEMENT : AIR_MOVEMENT);
		if(this.vel.x > 0) {
			if(this._moveDir > 0) { this.vel.x += MOVEMENT.ACC.MORE; }
			else if(this._moveDir < 0) { this.vel.x += MOVEMENT.ACC.LESS; }
			else { this.vel.x += MOVEMENT.ACC.DEFAULT; }
			if(this.vel.x < 0) {
				this.vel.x = (this._moveDir < 0 ? -MOVEMENT.INITIAL_SPEED : 0);
			}
		}
		else if(this.vel.x < 0) {
			if(this._moveDir > 0) { this.vel.x -= MOVEMENT.ACC.LESS; }
			else if(this._moveDir < 0) { this.vel.x -= MOVEMENT.ACC.MORE; }
			else { this.vel.x -= MOVEMENT.ACC.DEFAULT; }
			if(this.vel.x > 0) {
				this.vel.x = (this._moveDir > 0 ? MOVEMENT.INITIAL_SPEED : 0);
			}
		}
		else {
			if(this._moveDir > 0) { this.vel.x = MOVEMENT.INITIAL_SPEED; }
			else if(this._moveDir < 0) { this.vel.x = -MOVEMENT.INITIAL_SPEED; }
		}
		if(this.vel.x > MOVEMENT.TOP_SPEED) { this.vel.x = MOVEMENT.TOP_SPEED; }
		else if(this.vel.x < -MOVEMENT.TOP_SPEED) { this.vel.x = -MOVEMENT.TOP_SPEED; }
		if(this.vel.x < 0) { this._facing = -1; }
		else if(this.vel.x > 0) { this._facing = 1; }
		this.vel.y += GRAVITY;

		//handle jumping
		this._framesOfAutoJump--;
		if(this.vel.y > 0) {
			this._isJumping = false;
		}
		this._bottomCollisionsThisFrame = 0;

		//handle firing
		this._framesUntilAbleToFire--;
		if(this._framesUntilAbleToFire <= 0 && this._autoFire) {
			this.fireProjectile();
		}
	};
	Player.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._isStanding) {
				frame = 0;
			}
			else {
				frame = 17;
			}
			SPRITE.render(ctx, camera, this.pos.x - 12, this.pos.y - 10, frame, this._facing < 0);
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
			this.level.spawnActor(new MailProjectile(this.level, this.pos.x, this.pos.y));
			this._autoFire = false;
		}
		else if(this._framesUntilAbleToFire <= 6) {
			this._autoFire = true;
		}
	};
	return Player;
});