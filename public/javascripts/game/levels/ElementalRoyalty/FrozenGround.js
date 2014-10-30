if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Effect',
	'game/display/SpriteLoader'
], function(
	Global,
	Effect,
	SpriteLoader
) {
	var SUPERCLASS = Effect;
	var SPRITE = SpriteLoader.loadSpriteSheet('FROZEN_GROUND');
	function FrozenGround(x, y) {
		SUPERCLASS.call(this, x, y);
		this._isAlive = true;
		this._phase = 'growing';
		this._frames = 0;
	}
	FrozenGround.prototype = Object.create(SUPERCLASS.prototype);
	FrozenGround.prototype.update = function() {
		this._frames++;
		if(this._phase === 'disappearing' && this._frames >= 45) {
			this._isAlive = false;
		}
	};
	FrozenGround.prototype.isAlive = function() {
		return this._isAlive;
	};
	FrozenGround.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._phase === 'growing') {
				if(this._frames < 5) { frame = 0; }
				else if(this._frames < 5 + 7) { frame = 1; }
				else if(this._frames < 5 + 7 + 9) { frame = 2; }
				else if(this._frames < 5 + 7 + 9 + 11) { frame = 3; }
				else { frame = 4; }
			}
			else if(this._phase === 'exploding') {
				if(this._frames < 3) { frame = 5; }
				else { frame = 6; }
			}
			else if(this._phase === 'disappearing') {
				if(this._frames < 15) { frame = 7; }
				else if(this._frames < 30) { frame = 8; }
				else { frame = 9; }
			}
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, frame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	FrozenGround.prototype.explode = function() {
		this._phase = 'exploding';
		this._frames = 0;
	};
	FrozenGround.prototype.disappear = function() {
		this._phase = 'disappearing';
		this._frames = 0;
	};
	return FrozenGround;
});