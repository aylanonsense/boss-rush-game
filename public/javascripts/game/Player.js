if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	IceBlock,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('PLAYER');
	function Player(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.setMoveDir(0, 0);
		this._framesOfAutoJump = 0;
		this._isJumping = false;
		this._isStanding = false;
	}
	Player.prototype = Object.create(SUPERCLASS.prototype);
	Player.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this.vel.x = 500 * this._moveDir.x;
		this.vel.y = 500 * this._moveDir.y;
		this._framesOfAutoJump--;
		if(this.vel.y > 0) {
			this._isJumping = false;
		}
		this._bottomCollisionsThisFrame = 0;
	};
	Player.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, 0, false);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	Player.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 50, 50);
	};
	Player.prototype._recalculateHitBoxes = function() {
		this._hitboxes = [
			new Hitbox({ type: 'player', shape: new Rect(this.pos.x + 10, this.pos.y + 10, 30, 30) })
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
				this.vel.y = -300;
				this._isJumping = true;
				this._isStanding = false;
			}
		}
	};
	Player.prototype.setMoveDir = function(xDir, yDir) {
		this._moveDir = { x: xDir, y: yDir };
	};
	Player.prototype.jump = function() {
		this._framesOfAutoJump = 5;
	};
	Player.prototype.stopJumping = function() {
		if(this._isJumping && this.vel.y < 0) {
			this.vel.y = 0;
		}
	};
	return Player;
});