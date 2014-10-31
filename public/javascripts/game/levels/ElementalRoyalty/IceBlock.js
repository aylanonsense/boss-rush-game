if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/Snowflake',
	'game/levels/ElementalRoyalty/IceChip',
	'game/levels/ElementalRoyalty/IceShard',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	Snowflake,
	IceChip,
	IceShard,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('ICE_BLOCK');
	var SPAWN_FRAMES = 60;
	var DELAY_FRAMES = 20;
	var BLOCK_FRAME = 7;
	function IceBlock(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.width = 32;
		this.height = 32;
		this._frame = 0;
		this._shattered = false;
		this._platforms = [];
		this._health = 4;
		this._hurtFramesLeft = 0;
	}
	IceBlock.prototype = Object.create(SUPERCLASS.prototype);
	IceBlock.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		this._hurtFramesLeft--;
		if(this._frame > SPAWN_FRAMES + DELAY_FRAMES) {
			this.vel.y = 365;
		}
	};
	IceBlock.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame = BLOCK_FRAME;
			if(this._frame < SPAWN_FRAMES) {
				frame = Math.floor(BLOCK_FRAME * this._frame / SPAWN_FRAMES);
			}
			else if(this._health <= 2) {
				frame = 8;
			}
			var wiggle = 0;
			if(this._hurtFramesLeft > 0) {
				wiggle = 2 * (this._hurtFramesLeft % 2 === 0 ? -1 : 1);
			}
			SPRITE.render(ctx, camera, this.pos.x - 4 + wiggle, this.pos.y - 4, frame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	IceBlock.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 32, 32);
	};
	IceBlock.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hitboxes = [
			new Hitbox({
				type: 'shatter',
				shape: new Rect(this.pos.x, this.pos.y, 32, 32),
				onHit: function() {
					self._onShattered.apply(self, arguments);
				}
			}),
			new Hitbox({
				type: 'enemy',
				shape: new Rect(this.pos.x, this.pos.y, 32, 32),
				onHit: function() {
					self._onDamaged.apply(self, arguments);
				}
			})
		];
		if(this.vel.y === 0 && this._frame > SPAWN_FRAMES + DELAY_FRAMES) {
			this.platform = new Rect(this.pos.x, this.pos.y, 32, 32);
			this._hurtboxes = [];
		}
		else {
			this.platform = null;
			this._hurtboxes = [
				new Hitbox({
					type: 'player',
					shape: new Rect(this.pos.x, this.pos.y, 32, 32),
					onHit: function(player) { player.hurt(3); }
				})
			];
		}
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	IceBlock.prototype._onShattered = function() {
		if(!this._shattered) {
			this._shattered = true;
			this.level.spawnEffect(new Snowflake(this.pos.x, this.pos.y, 0));
			this.level.spawnEffect(new Snowflake(this.pos.x, this.pos.y, Math.PI));
			this.level.spawnEffect(new IceChip(this.center.x, this.center.y));
			this.level.spawnEffect(new IceChip(this.center.x, this.center.y));
			this.level.spawnActor(new IceShard(this.level, this.pos.x, this.pos.y, 3));
			this.level.spawnActor(new IceShard(this.level, this.pos.x, this.pos.y, 13));
		}
	};
	IceBlock.prototype.isAlive = function() {
		return !this._shattered && this._health > 0;
	};
	IceBlock.prototype._onDamaged = function() {
		this._health--;
		this._hurtFramesLeft = 6;
		if(this._health === 2) {
			this.level.spawnEffect(new IceChip(this.center.x, this.center.y));
		}
		else if(this._health === 0) {
			this.level.spawnEffect(new IceChip(this.center.x, this.center.y));
			this.level.spawnEffect(new IceChip(this.center.x, this.center.y));
		}
	};
	IceBlock.prototype._onCollided = function(thing, dir) {
		this.vel.y = 0;
	};
	return IceBlock;
});