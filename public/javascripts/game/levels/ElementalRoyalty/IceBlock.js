if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/levels/BeeLevel/PollenEffect',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	PollenEffect,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('ICE_BLOCK');
	var SPAWN_FRAMES = 60;
	var DELAY_FRAMES = 20;
	var BLOCK_FRAME = 7;
	function IceBlock(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this._frame = 0;
	}
	IceBlock.prototype = Object.create(SUPERCLASS.prototype);
	IceBlock.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		if(this._frame > SPAWN_FRAMES + DELAY_FRAMES) {
			this.vel.y = 350;
		}
	};
	IceBlock.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame = BLOCK_FRAME;
			if(this._frame < SPAWN_FRAMES) {
				frame = Math.floor(BLOCK_FRAME * this._frame / SPAWN_FRAMES);
			}
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, frame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	IceBlock.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		this._createCollisionBoxes(5, 10, 33, 20);
	};
	IceBlock.prototype._onCollided = function(thing, dir) {
		//TODO
	};
	return IceBlock;
});