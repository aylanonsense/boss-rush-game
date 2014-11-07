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
	var SPRITE = SpriteLoader.loadSpriteSheet('SCORCHING_SLASH');
	function ScorchingSlash(x, y, flipped, slash) {
		SUPERCLASS.call(this, x, y);
		//randomly determine dislay
		this._frameOffset = {
			'first-floaty-slash': 0,
			'second-floaty-slash': 4,
			'third-floaty-slash': 8
		}[slash];
		this._frame = 0;
		this._flipped = flipped;
	}
	ScorchingSlash.prototype = Object.create(SUPERCLASS.prototype);
	ScorchingSlash.prototype.update = function() {
		this._frame++;
	};
	ScorchingSlash.prototype.isAlive = function() {
		return this._frame < 4 * 4;
	};
	ScorchingSlash.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._frame < 4 * 1) { frame = 0; }
			else if(this._frame < 4 * 2) { frame = 1; }
			else if(this._frame < 4 * 3) { frame = 2; }
			else { frame = 3; }
			SPRITE.render(ctx, camera, this.pos.x - 6 * (this._flipped ? 20.5 : 29.5),
				this.pos.y - 6 * 27.5, frame + this._frameOffset, this._flipped);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	return ScorchingSlash;
});