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
	function IceShard(level, x, y, dir) {
		SUPERCLASS.call(this, level, x, y);
		this.width = 15;
		this.height = 15;
		var speed = 600;
		var angle = Math.PI * dir / 8 - Math.PI / 2;
		if(dir % 4 === 1) { angle -= Math.PI * 1.25 / 16; }
		else if(dir % 4 === 3) { angle += Math.PI * 1.25 / 16; }
		this.vel.x = speed * Math.cos(angle);
		this.vel.y = speed * Math.sin(angle);
		this.collidesWithActors = false;
		this._isAlive = true;
		this._shardFrame = dir;
	}
	IceShard.prototype = Object.create(SUPERCLASS.prototype);
	IceShard.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
	};
	IceShard.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x - 4 * 11 / 2 + this.width / 2, this.pos.y - 4 * 11 / 2 + this.height / 2, this._shardFrame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	IceShard.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(0, 0, 16, 16);
	};
	IceShard.prototype._recalculateHitBoxes = function() {
		var self = this;
		this._hurtboxes = [
			new Hitbox({
				type: 'player',
				shape: new Rect(this.pos.x, this.pos.y, 16, 16),
				onHit: function(player) { player.hurt(3); }
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