if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/levels/ElementalRoyalty/IceShard',
	'game/levels/ElementalRoyalty/ScepterShine',
	'game/levels/ElementalRoyalty/Snowflake',
	'game/levels/ElementalRoyalty/FrozenGround',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	IceBlock,
	IceShard,
	ScepterShine,
	Snowflake,
	FrozenGround,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('FROZEN_KING');
	var SPRITE_DAMAGED = SpriteLoader.loadSpriteSheet('FROZEN_KING_DAMAGED');
	var GRAVITY = 25;
	function FrozenKing(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.width = 80;
		this.height = 120;
		this.collidesWithActors = false;
		this.maxHealth = 80;
		this.health = this.maxHealth;
		this.ignoreCollisions = true;
		this._pose = 'start';
		this._aiDisabled = true;
		this._actionQueue = [];
		this._currentAction = 'pause';
		this._prevAction = null;
		this._currentActionFrame = 0;
		this._currentActionPhase = null;
		this._loops = 0;
		this._facing = -1;
		this._hurtFramesLeft = 0;
		this._frozenGroundStartPoint = null;
		this._frozenGround = [];
		this._isFreezingGround = false;
		this._hasPerformedAShardBurst = false;
		this._hasPerformedGroundFreeze = false;
	}
	FrozenKing.prototype = Object.create(SUPERCLASS.prototype);
	FrozenKing.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);

		//continue doing whatever you were doing
		this._currentActionFrame++;
		this._handleCurrentAction();

		//if you're done acting, do the next thing
		if(!this._currentAction && !this._aiDisabled) {
			if(this._actionQueue.length === 0) {
				//at the start of the fight, just do a spawnblocks --> jump combo over and over
				if(this.health > this.maxHealth * 0.75) {
					this._actionQueue = [ 'spawnblocks', 'pause', 'jump', 'pause' ];
				}
				//at 75%, start mixing in a shardburst (do one immediately)
				else if(this.health > this.maxHealth * 0.50) {
					if(!this._hasPerformedAShardBurst || (this._prevAction !== 'shardburst' && Math.random() < 0.5)) {
						this._actionQueue = [ 'shardburst', 'pause', 'pause' ];
						this._hasPerformedAShardBurst = true;
					}
					else {
						this._actionQueue = [ 'spawnblocks', 'pause', 'jump', 'pause' ];
					}
				}
				//at 50%, start mixing in freezeground (do one immediately)
				else {
					if(!this._hasPerformedGroundFreeze || (this._prevAction !== 'freezeground' && Math.random() < 0.3)) {
						this._hasPerformedGroundFreeze = true;
						this._actionQueue = [ 'freezeground', 'pause' ];
					}
					else if(this._prevAction !== 'shardburst' && Math.random() < 0.3) {
						this._actionQueue = [ 'shardburst', 'pause', 'pause' ];
						this._hasPerformedAShardBurst = true;
					}
					else {
						this._actionQueue = [ 'spawnblocks', 'pause', 'jump', 'pause' ];
					}
				}
				this._loops++;
			}
			//decide on next action
			this._currentAction = this._actionQueue.shift();
			this._currentActionFrame = 0;
			this._handleCurrentAction();
		}

		this._hurtFramesLeft--;
		this.vel.y += GRAVITY;
		if(this.vel.y > GRAVITY * 75 / 2) {
			this.vel.y = GRAVITY * 75 / 2;
		}
	};
	FrozenKing.prototype._handleCurrentAction = function() {
		var i;
		if(this._currentAction !== 'pause' && this._currentAction !== null) {
			this._prevAction = this._currentAction;
		}
		if(this._currentAction === 'jump') {
			if(this._currentActionFrame === 15) {
				var dx = this.level.player.center.x - this.center.x;
				var numFrames = 75;
				this.vel.x = dx * 60 / numFrames;
				this.vel.y = -GRAVITY * numFrames / 2;
				this._facing = (this.vel.x > 0 ? 1 : -1);
			}
			else if(this._currentActionFrame > 140) {
				this._currentAction = null;
			}
		}
		else if(this._currentAction === 'spawnblocks') {
			if(this._currentActionFrame === 0) {
				this._facing = (this.level.player.center.x < this.center.x ? -1 : 1);
			}
			else if(this._currentActionFrame === 20 || this._currentActionFrame === 50 ||
				this._currentActionFrame === 80 || this._currentActionFrame === 110) {
				this._facing = (this.level.player.center.x < this.center.x ? -1 : 1);
				this.level.spawnActor(new IceBlock(this.level,
					32 * Math.round(this.level.player.center.x / 32) - 16,
					32 * 8 - 32 * (this._currentActionFrame + 10) / 30));
				this.level.spawnEffect(new ScepterShine(this.pos.x + this._facing * 4 * 22, this.pos.y - 4 * 12));
			}
			else if(this._currentActionFrame > 120) {
				this._currentAction = null;
			}
		}
		else if(this._currentAction === 'freezeground') {
			if(this._currentActionFrame === 0) {
				this._currentActionPhase = 'prep';
				this._facing = (this.level.player.center.x < this.center.x ? -1 : 1);
				this._frameOfFrozenGroundExplosion = 9999;
			}
			else if(this._currentActionFrame === 10) {
				this.level.spawnEffect(new ScepterShine(this.pos.x + this._facing * 4 * 20, this.pos.y + 4 * 10));
			}
			else if(this._currentActionFrame === 34) {
				this._currentActionPhase = 'stab';
				this._frozenGroundStartPoint = 32 * Math.round(this.center.x / 32) + 40 * this._facing;
			}
			else if(this._currentActionFrame >= 35 && this._currentActionFrame < this._frameOfFrozenGroundExplosion) {
				if(this._currentActionFrame % 2 === 0) {
					i = (this._currentActionFrame - 35) / 2;
					var x = this._frozenGroundStartPoint + 32 * i;
					var addedFrozenGround = false;
					if(x < Global.WIDTH + 1 * 32) {
						this._frozenGround.push(this.level.spawnEffect(new FrozenGround(x, 572)));
						addedFrozenGround = true;
					}
					x = this._frozenGroundStartPoint - 32 * (i - 1);
					if(x > 32) {
						this._frozenGround.push(this.level.spawnEffect(new FrozenGround(x, 572)));
						addedFrozenGround = true;
					}
					if(!addedFrozenGround) {
						this._isFreezingGround = true;
						for(i = 0; i < this._frozenGround.length; i++) {
							this._frozenGround[i].explode();
						}
						for(i = 64; i < Global.WIDTH + 32; i += 32) {
							this.level.spawnEffect(new Snowflake(i, 560, Math.PI * 3 / 2));
						}
						this._frameOfFrozenGroundExplosion = this._currentActionFrame;
					}
				}
			}
			else if(this._currentActionFrame === this._frameOfFrozenGroundExplosion + 75) {
				this._isFreezingGround = false;
				this._currentActionPhase = 'release';
				for(i = 0; i < this._frozenGround.length; i++) {
					this._frozenGround[i].disappear();
				}
				this._frozenGround = [];
			}
			else if(this._currentActionFrame > this._frameOfFrozenGroundExplosion + 95) {
				this._currentAction = null;
			}
		}
		else if(this._currentAction === 'shardburst') {
			if(this._currentActionFrame === 0) {
				this._currentActionPhase = 'prep';
			}
			else if(this._currentActionFrame === 10) {
				this.level.spawnEffect(new ScepterShine(this.pos.x + this._facing * 4 * 4, this.pos.y - 4 * 6));
			}
			else if(this._currentActionFrame === 50) {
				this._currentActionPhase = 'burst';
				for(i = 0; i < 16; i++) {
					this.level.spawnActor(new IceShard(this.level, this.pos.x, this.pos.y + 52, i));
				}
			}
			else if(this._currentActionFrame === 120) {
				this._currentAction = null;
			}
		}
	else if(this._currentAction === 'pause') {
			if(this._currentActionFrame > 15) {
				this._currentAction = null;
			}
		}
	};
	FrozenKing.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame = 0;
			if(this._pose === 'intro') {
				frame = 8;
			}
			else if(this._pose === 'start') {
				frame = (this.vel.y === 0 ? 7 : 3);
			}
			else if(this._currentAction === 'jump') {
				if(this.vel.y > 0) { frame = 3; }
				else if(this.vel.y < 0) { frame = 2; }
				else { frame = 1; }
			}
			else if(this._currentAction === 'spawnblocks') {
				frame = 4;
			}
			else if(this._currentAction === 'pause') {
				frame = 0;
			}
			else if(this._currentAction === 'freezeground') {
				frame = (this._currentActionPhase === 'stab' ? 6 : 5);
			}
			else if(this._currentAction === 'shardburst') {
				frame = (this._currentActionPhase === 'prep' ? 7 : 8);
			}
			var wiggle = 0;
			if(this._hurtFramesLeft > 0) {
				wiggle = 2 * (this._hurtFramesLeft % 2 === 0 ? -1 : 1);
			}
			var sprite = (this._hurtFramesLeft > 0 ? SPRITE_DAMAGED : SPRITE);
			sprite.render(ctx, camera, this.pos.x - 88 + wiggle, this.pos.y - 120, frame, this._facing > 0);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	FrozenKing.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		if(!this.ignoreCollisions) {
			this._createCollisionBoxes(0, 0, 80, 120);
		}
	};
	FrozenKing.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hurtboxes = [
			new Hitbox({
				type: 'shatter',
				shape: new Rect(this.pos.x - 4, this.pos.y + 14, 88, 110)
			}),
			new Hitbox({
				type: 'player',
				shape: new Rect(this.pos.x, this.pos.y + 8, 80, 112),
				onHit: function(player) { player.hurt(self.vel.y > 0 ? 3 : 2); }
			})
		];
		if(this._isFreezingGround) {
			this._hurtboxes.push(new Hitbox({
				type: 'player',
				shape: new Rect(64, 570, 768, 64),
				onHit: function(player) { player.hurt(3); }
			}));
		}
		this._hitboxes = [
			new Hitbox({
				type: 'enemy',
				shape: new Rect(this.pos.x, this.pos.y, 80, 120),
				onHit: function() { self.hurt(); }
			})
		];
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	FrozenKing.prototype._onCollided = function(thing, dir) {
		if(dir === 'bottom') {
			this.vel.y = 0;
			this.vel.x = 0;
		}
	};
	FrozenKing.prototype.hurt = function() {
		this._hurtFramesLeft = 7;
		this.health -= 1;
	};
	FrozenKing.prototype.strikeIntroPose = function() {
		this._pose = 'intro';
	};
	FrozenKing.prototype.startFighting = function() {
		this._aiDisabled = false;
		this._pose = null;
	};
	return FrozenKing;
});