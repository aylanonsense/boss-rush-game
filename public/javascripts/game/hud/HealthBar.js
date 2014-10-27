if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/display/SpriteLoader'
], function(
	Global,
	SpriteLoader
) {
	var SPRITE = SpriteLoader.loadSpriteSheet('HUD_HEALTH_BAR');
	var PIP_SPRITE = SpriteLoader.loadSpriteSheet('HUD_HEALTH_PIP');
	function HealthBar(type, x, y) {
		this._x = x;
		this._y = y;
		this._type = type;
		this._actor = null;
	}
	HealthBar.prototype.render = function(ctx) {
		SPRITE.render(ctx, { x: 0, y: 0 }, this._x, this._y, (this._type === 'player' ? 0 : 1), false);
		if(this._actor) {
			var numPips = Math.ceil(20 * this._actor.health / this._actor.maxHealth);
			for(var i = 0; i < numPips; i++) {
				PIP_SPRITE.render(ctx, { x: 0, y: 0 }, this._x + 2 * 4 + i * 2 * 4, this._y + 2 * 4, (this._type === 'player' ? 0 : 1), false);
			}
		}
	};
	HealthBar.prototype.setActor = function(actor) {
		this._actor = actor;
	};
	return HealthBar;
});