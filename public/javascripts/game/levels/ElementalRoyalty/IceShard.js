if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/geom/Line',
	'game/levels/ElementalRoyalty/Snowflake',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	Line,
	Snowflake,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('ICE_SHARD');
	function IceShard(level, x, y, movingLeft) {
		SUPERCLASS.call(this, level, x, y);
		this.vel.x = (movingLeft ? -1 : 1) * 250;
		this.vel.y = -250;
		this._isAlive = true;
		this._shardFrame = (movingLeft ? 0: 1);
	}
	IceShard.prototype = Object.create(SUPERCLASS.prototype);
	IceShard.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
	};
	IceShard.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x - 12, this.pos.y - 12, this._shardFrame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	IceShard.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		if(this.vel.x < 0) {
			this._createCollisionBoxes(4, 6, 15, 15);
		}
		else {
			this._createCollisionBoxes(0, 6, 15, 15);
		}
	};
	IceShard.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hurtboxes = [
			new Hitbox({
				type: 'player',
				shape: (this.vel.x < 0 ?
					new Line(this.pos.x, this.pos.y, this.pos.x + 20, this.pos.y + 20) :
					new Line(this.pos.x + 20, this.pos.y, this.pos.x, this.pos.y + 20)),
				onHit: function() {
					self._onShattered.apply(self, arguments);
				}
			})
		];
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	IceShard.prototype.isAlive = function() {
		return this._isAlive;
	};
	IceShard.prototype._onCollided = function(thing, dir) {
		var angle;
		if(dir === 'top') { angle = Math.PI / 2; }
		else if(dir === 'left') { angle = 0; }
		else if(dir === 'right') { angle = Math.PI; }
		else { angle = -Math.PI / 2; }
		this.level.spawnEffect(new Snowflake(this.pos.x, this.pos.y, angle));
		this.level.spawnEffect(new Snowflake(this.pos.x, this.pos.y, angle));
		this._isAlive = false;
	};
	return IceShard;
});