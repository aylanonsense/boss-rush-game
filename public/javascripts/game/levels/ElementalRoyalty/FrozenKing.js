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
	var SPRITE = SpriteLoader.loadSpriteSheet('FROZEN_KING');
	var SPRITE_DAMAGED = SpriteLoader.loadSpriteSheet('FROZEN_KING_DAMAGED');
	var GRAVITY = 17;
	function FrozenKing(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.width = 80;
		this.height = 120;
		this._frame = 0;
		this._jumpTarget = 0;
		this._facing = -1;
		this.collidesWithActors = false;
		this._currentAction = 'pause';
		this._currentActionFramesRemaining = 60;
		this._hurtFramesLeft = 0;
		this.maxHealth = 80;
		this.health = this.maxHealth;
	}
	FrozenKing.prototype = Object.create(SUPERCLASS.prototype);
	FrozenKing.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		this._hurtFramesLeft--;

		//complete actions and pause after them
		if(this._currentAction !== null) {
			this._currentActionFramesRemaining--;
			if(this._currentActionFramesRemaining <= 0) {
				if(this._currentAction === 'preppingtojump') {
					this.jump(32 * Math.floor(2 + 22 * Math.random()));
				}
				else if(this._currentAction !== 'pause') {
					this._currentAction = 'pause';
					this._currentActionFramesRemaining = 30;
				}
				else {
					this._currentAction = null;
					this._currentActionFramesRemaining = 0;
				}
			}
		}

		//decide what to do next
		if(this._currentAction === null) {
			if(Math.random() < 0.5) {
				this.prepToJump();
			}
			else {
				this.spawnIceBlock(32 * Math.floor(2 + 24 * Math.random()));
			}
		}

		this.vel.y += GRAVITY;
	};
	FrozenKing.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame = 0;
			if(this._currentAction === 'jumping') {
				if(this.vel.y > 0) { frame = 3; }
				else if(this.vel.y < 0) { frame = 2; }
			}
			else if(this._currentAction === 'spawningblock') {
				frame = 9;
			}
			else if(this._currentAction === 'preppingtojump') {
				frame = 1;
			}
			var wiggle = 0;
			if(this._hurtFramesLeft > 0) {
				wiggle = 2 * (this._hurtFramesLeft % 2 === 0 ? -1 : 1);
			}
			var sprite = (this._hurtFramesLeft > 0 ? SPRITE_DAMAGED : SPRITE);
			sprite.render(ctx, camera, this.pos.x - 88 + wiggle, this.pos.y - 120, frame, this._facing > 0);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
		if(Global.DEV_MODE && ! Global.DEBUG_MODE) {
			if(this._jumpTarget) {
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(this._jumpTarget - 48, 0);
				ctx.lineTo(this._jumpTarget - 48, Global.HEIGHT);
				ctx.stroke();
			}
		}
	};
	FrozenKing.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 80, 120);
	};
	FrozenKing.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hurtboxes = [
			new Hitbox({ type: 'shatter', shape: new Rect(this.pos.x - 4, this.pos.y + 44, 88, 80) }),
			new Hitbox({
				type: 'player',
				shape: new Rect(this.pos.x, this.pos.y + 8, 80, 112),
				onHit: function(player) { player.hurt(1); }
			})
		];
		this._hitboxes = [
			new Hitbox({
				type: 'enemy',
				shape: new Rect(this.pos.x, this.pos.y + 8, 80, 112),
				onHit: function() {
					self.hurt();
				}
			})
		];
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	FrozenKing.prototype._onCollided = function(thing, dir) {
		if(dir === 'bottom') {
			this.vel.y = 0;
			this.vel.x = 0;
			this._jumpTarget = null;
		}
	};
	FrozenKing.prototype.spawnIceBlock = function(x) {
		this.level.spawnActor(new IceBlock(this.level, x, 150));
		this._facing = (x < this.pos.x ? -1 : 1);
		this._currentAction = 'spawningblock';
		this._currentActionFramesRemaining = 60;
	};
	FrozenKing.prototype.prepToJump = function() {
		this._currentAction = 'preppingtojump';
		this._currentActionFramesRemaining = 20;
	};
	FrozenKing.prototype.jump = function(x) {
		var dx = (x || this.pos.x) - this.pos.x;
		//we want all jumps to last 60 frames
		var numFrames = 95;
		//here's the x vel that'll get us there in 60 frames
		this.vel.x = dx * 60 / numFrames;
		this._facing = (this.vel.x > 0 ? 1 : -1);
		//okay here's the tricky part, what will keep us in the air for 60 frames?
		this.vel.y = -GRAVITY * numFrames / 2;
		this._jumpTarget = x;
		this._currentAction = 'jumping';
		this._currentActionFramesRemaining = numFrames;
	};
	FrozenKing.prototype.hurt = function() {
		this._hurtFramesLeft = 7;
		this.health -= 1;
	};
	return FrozenKing;
});