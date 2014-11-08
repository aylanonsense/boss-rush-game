if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/utils/ActionQueue',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/Phase2/ScorchingSlash',
	'game/levels/ElementalRoyalty/Phase2/Fireball',
	'game/levels/ElementalRoyalty/Phase2/FirePillarWave',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	ActionQueue,
	Hitbox,
	Rect,
	ScorchingSlash,
	Fireball,
	FirePillarWave,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('SCORCHING_QUEEN');
	var GRAVITY = 10;
	var SCALE = 6;
	function ScorchingQueen(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.width = 9 * SCALE;
		this.height = 17 * SCALE;
		this.collidesWithActors = false;
		this.maxHealth = 80;
		this.health = this.maxHealth;
		this._facing = -1;
		this._actionQueue = new ActionQueue(this);
		this._actionQueue.then(this._fallToGround).then(this._landOnGround).then(this._pause);
		this._renderFrame = 0;
		this._isFloating = true;
	}
	ScorchingQueen.prototype = Object.create(SUPERCLASS.prototype);
	ScorchingQueen.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this.vel.y += (this._isFloating ? 0 : GRAVITY);
		this._actionQueue.tick();
		for(var i = 0; i <= 2 && this._actionQueue.readyForInput(); i ++) {
			if(i === 2) { throw new Error("Queued actions too many times in one frame"); }
			this._decideNextAction();
			this._actionQueue.tick();
		}
	};
	ScorchingQueen.prototype._decideNextAction = function() {
		this._actionQueue
			.then(this._jumpToCorner)
			.then(this._floatySlash)
			.then(this._fallToGround)
			.then(this._landOnGround)
			.then(this._pause)
			.then(this._runTowardsPlayer)
			.then(this._runningSlash)
			.then(this._pause)
			.then(this._jumpToCorner)
			.then(this._fallToGround)
			.then(this._landOnGround)
			.then(this._stabGround)
			.then(this._pause);
	};
	ScorchingQueen.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x - (this._facing > 0 ? 13 : 10) * SCALE,
				this.pos.y - 12 * SCALE, this._renderFrame, this._facing > 0);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	ScorchingQueen.prototype._onCollided = function(thing, dir) {
		if(dir === 'bottom') {
			this.vel.y = 0;
			this._hasHitGround = true;
		}
	};
	ScorchingQueen.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 9 * SCALE, 17 * SCALE);
	};
	ScorchingQueen.prototype._recalculateHitBoxes = function() {
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	ScorchingQueen.prototype._jumpToCorner = function(frame, done) {
		//prepare to jump
		if(frame === 0) {
			this._jumpTarget = {
				x: (this.level.player.center.x > this.level.bounds.center.x ?
					this.level.bounds.left + 140 :
					this.level.bounds.right - 140),
				y: this.level.bounds.top + 164
			};
			var dx = (this._jumpTarget.x - this.center.x);
			var dy = (this._jumpTarget.y - this.center.y);
			var dist = Math.sqrt(dx * dx + dy * dy);
			var speed = 800;
			this._jumpTarget.vel = { x: speed * dx / dist, y: speed * dy / dist };
			this._jumpTarget.frames = Math.floor(dist * 60 / speed);
			this._renderFrame = 6; //landing OR preparing to jump
		}
		var frameToJump = 30;
		var frameToArriveAtTarget = this._jumpTarget.frames + frameToJump;
		var frameToStopPausingAfterArriving = 15 + frameToArriveAtTarget;
		//jump
		if(frame === frameToJump) {
			this.vel.x = this._jumpTarget.vel.x;
			this.vel.y = this._jumpTarget.vel.y;
			if(this.vel.x < -150) { this._renderFrame = (this._facing < 0 ? 7 : 9); } //jumping forward / backward
			else if(this.vel.x > 150) { this._renderFrame = (this._facing < 0 ? 9 : 7); } //jumping backward / forward
			else { this._renderFrame = 8; } //jumping straight up
			this._isFloating = true;
		}
		//float in mid-air
		if(frame === frameToArriveAtTarget) {
			this._renderFrame = 10; //floating
			this._facing = (this.center.x < this.level.bounds.center.x ? 1 : -1);
			this.vel.x = 0;
			this.vel.y = 0;
			this.pos.x = this._jumpTarget.x - this.width / 2;
			this.pos.y = this._jumpTarget.y - this.height / 2;
		}
		//pause for a sec
		if(frame === frameToStopPausingAfterArriving) {
			done(true);
		}
	};
	ScorchingQueen.prototype._floatySlash = function(frame, done) {
		var frameToStartCharging = 0;
		var frameToSlashOnce = 20 + frameToStartCharging;
		var frameToSlashTwice = 25 + frameToSlashOnce;
		var frameToSlashThrice = 25 + frameToSlashTwice;
		var frameToPause = 25 + frameToSlashThrice;
		var frameToEnd = 25 + frameToPause;
		//charge floaty slash
		if(frame === frameToStartCharging) {
			this._renderFrame = 11; //charging floaty slash
		}
		//first slash
		if(frame === frameToSlashOnce) {
			this._renderFrame = 12; //slashing (first floaty slash)
			this.level.spawnEffect(new ScorchingSlash(this.center.x, this.center.y, this._facing > 0, 'first-floaty-slash'));
			this.level.spawnActor(new Fireball(this.level, this.center.x, this.center.y,
				this.level.player.center.x - 21, this.level.player.center.y - 21));
		}
		//second slash
		if(frame === frameToSlashTwice) {
			this._renderFrame = 13; //slashing (second floaty slash)
			this.level.spawnEffect(new ScorchingSlash(this.center.x, this.center.y, this._facing > 0, 'second-floaty-slash'));
			this.level.spawnActor(new Fireball(this.level, this.center.x, this.center.y,
				this.level.player.center.x - 21, this.level.player.center.y - 21));
		}
		//third slash
		if(frame === frameToSlashThrice) {
			this._renderFrame = 14; //slashing (third floaty slash)
			this.level.spawnEffect(new ScorchingSlash(this.center.x, this.center.y, this._facing > 0, 'third-floaty-slash'));
			this.level.spawnActor(new Fireball(this.level, this.center.x, this.center.y,
				this.level.player.center.x - 21, this.level.player.center.y - 21));
		}
		//float in mid-air
		if(frame === frameToPause) {
			this._renderFrame = 10; //floating
		}
		//next action
		if(frame === frameToEnd) {
			done(true);
		}
	};
	ScorchingQueen.prototype._fallToGround = function(frame, done) {
		if(frame === 0) {
			this._hasLanded = false;
			if(this.vel.y < GRAVITY) {
				this.vel.y = GRAVITY;
			}
			this._isFloating = false;
			this._renderFrame = 15; //falling
			this._hasHitGround = false;
		}
		if(this._hasHitGround) {
			this._renderFrame = 0; //standing
			done(true);
		}
	};
	ScorchingQueen.prototype._landOnGround = function(frame, done) {
		var frameToLandOn = 0;
		var frameToGetUpOn = 20 + frameToLandOn;
		if(frame === frameToLandOn) {
			this._renderFrame = 6; //landing OR preparing to jump
		}
		if(frame === frameToGetUpOn) {
			this._renderFrame = 0; //standing
			done(true);
		}
	};
	ScorchingQueen.prototype._pause = function(frame, done) {
		if(frame === 20) {
			done(true);
		}
	};
	ScorchingQueen.prototype._stabGround = function(frame, done) {
		var frameToStartCharging = 0;
		var frameToStabGround = 50 + frameToStartCharging;
		var frameToReleaseFromGround = 60 + frameToStabGround;
		var frameToEnd = 15 + frameToReleaseFromGround;
		//charge stab
		if(frame === frameToStartCharging) {
			this._renderFrame = 16; //preparring to / recovering from stabbing the ground
		}
		//stab ground
		if(frame === frameToStabGround) {
			this._renderFrame = 17; //stabbing the ground
			this.level.spawnActor(new FirePillarWave(this.level, this.center.x, this.pos.y + this.height));//this.pos.x, this.pos.y));
		}
		//release grab
		if(frame === frameToReleaseFromGround) {
			this._renderFrame = 16; //preparring to / recovering from stabbing the ground
		}
		//next action
		if(frame === frameToEnd) {
			this._renderFrame = 0; //standing
			done(true);
		}
	};
	ScorchingQueen.prototype._runTowardsPlayer = function(frame, done) {
		var frameToStartPrepping = 0;
		var frameToStartRunning = 20 + frameToStartPrepping;
		if(frame === frameToStartPrepping) {
			this._renderFrame = 6; //landing OR preparing to jump
		}
		if(frame >= frameToStartRunning) {
			this._facing = (this.level.player.center.x < this.center.x ? -1 : 1);
			this.vel.x = this._facing * 400;
			this._renderFrame = ((frame - frameToStartRunning) % 20 < 10 ? 1 : 2);
			if(this.level.player.center.x - 100 < this.center.x && this.center.x < this.level.player.center.x + 100) {
				this.vel.x = 0;
				this._renderFrame = 0; //standing
				done(true);
			}
		}
	};
	ScorchingQueen.prototype._runningSlash = function(frame, done) {
		var frameToChargeSlash = 0;
		var frameToSlash = 20 + frameToChargeSlash;
		var frameToRecover = 80 + frameToSlash;
		var frameToEnd = 30 + frameToRecover;
		//charge running slash
		if(frame === frameToChargeSlash) {
			this.vel.x = this._facing * 100;
			this._renderFrame = 3;
		}
		//running slash
		if(frame === frameToSlash) {
			this.vel.x = 0;
			this._renderFrame = 4;
			this.level.spawnEffect(new ScorchingSlash(this.center.x, this.center.y, this._facing > 0, 'third-floaty-slash'));
			//TODO spawn bombs
		}
		//recover from running slash
		if(frame === frameToRecover) {
			this._renderFrame = 5;
		}
		//next action
		if(frame === frameToEnd) {
			this._renderFrame = 0; //standing
			done(true);
		}
	};
	return ScorchingQueen;
});