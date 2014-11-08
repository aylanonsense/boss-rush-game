if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Actor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/Phase2/FirePillar',
	'game/display/SpriteLoader'
], function(
	Global,
	Actor,
	Hitbox,
	Rect,
	FirePillar,
	SpriteLoader
) {
	var SUPERCLASS = Actor;
	var SPRITE = SpriteLoader.loadSpriteSheet('FIRE_PILLAR');
	function FirePillarWave(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this._frame = 0;
		this._leftFlameX = 50 * Math.round(x / 50);
		this._rightFlameX = this._leftFlameX;
	}
	FirePillarWave.prototype = Object.create(SUPERCLASS.prototype);
	FirePillarWave.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		if(this._frame % 23 === 0) {
			this._leftFlameX -= 50;
			this._rightFlameX += 50;
			if(this._leftFlameX > this.level.bounds.left) {
				this.level.spawnActor(new FirePillar(this.level, this._leftFlameX, this.pos.y));
			}
			if(this._rightFlameX < this.level.bounds.right) {
				this.level.spawnActor(new FirePillar(this.level, this._rightFlameX, this.pos.y));
			}
		}
	};
	FirePillarWave.prototype.render = function() {};
	FirePillarWave.prototype._recalculateHitBoxes = function() {};
	FirePillarWave.prototype.isAlive = function() {
		return this._leftFlameX > this.level.bounds.left || this._rightFlameX < this.level.bounds.right;
	};
	return FirePillarWave;
});