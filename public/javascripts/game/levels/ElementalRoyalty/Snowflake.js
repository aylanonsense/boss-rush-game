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
	var SPRITE = SpriteLoader.loadSpriteSheet('SNOWFLAKE');
	function Snowflake(x, y) {
		SUPERCLASS.call(this, x, y);
		this._frame = 0;
		this._framesLeftAlive = 40;
		this._snowflakeFrame = 3 + Math.floor(4 * Math.random());
	}
	Snowflake.prototype = Object.create(SUPERCLASS.prototype);
	Snowflake.prototype.update = function() {
		//this.pos.y -= 1;
		this._frame++;
		this._framesLeftAlive--;
	};
	Snowflake.prototype.isAlive = function() {
		return this._framesLeftAlive >= 0;
	};
	Snowflake.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, this._snowflakeFrame);
		}
	};
	return Snowflake;
});