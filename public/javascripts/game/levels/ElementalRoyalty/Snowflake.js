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
	function Snowflake(x, y, angle) {
		SUPERCLASS.call(this, x, y);
		//randomly determine dislay
		this._framesLeftAlive = 25 + 20 * Math.random();
		angle = angle - 0.33 + 0.66 * Math.random();
		var speed = 250 + 300 * Math.random();
		this.vel = { x: speed * Math.cos(angle), y: speed * Math.sin(angle) };
		this._snowflakeFrame = 3 + Math.floor(4 * Math.random());
	}
	Snowflake.prototype = Object.create(SUPERCLASS.prototype);
	Snowflake.prototype.update = function() {
		this._framesLeftAlive--;
		this.vel.x *= 0.9;
		this.vel.y *= 0.9;
		this.vel.y += 0.1;
		this.pos.x += this.vel.x / 60;
		this.pos.y += this.vel.y / 60;
	};
	Snowflake.prototype.isAlive = function() {
		return this._framesLeftAlive >= 0;
	};
	Snowflake.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, this._snowflakeFrame);
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	return Snowflake;
});