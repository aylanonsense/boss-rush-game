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
		this._timeSpentFilling = 0;
		this._timeToFill = 0;
		this._isHidden = false;
	}
	HealthBar.prototype.render = function(ctx) {
		if(!this._isHidden) {
			SPRITE.render(ctx, { x: 0, y: 0 }, this._x, this._y, (this._type === 'player' ? 0 : 1), false);
			if(this._actor) {
				var numPips = Math.ceil(20 * this._actor.health / this._actor.maxHealth);
				if(this._timeSpentFilling < this._timeToFill) {
					this._timeSpentFilling++;
					numPips = Math.floor(numPips * this._timeSpentFilling / this._timeToFill);
				}
				for(var i = 0; i < numPips; i++) {
					PIP_SPRITE.render(ctx, { x: 0, y: 0 }, this._x + 2 * 4 + i * 2 * 4, this._y + 2 * 4, (this._type === 'player' ? 0 : 1), false);
				}
			}
		}
	};
	HealthBar.prototype.fillFromEmpty = function() {
		this._timeToFill = 100;
		this._timeSpentFilling = 0;
	};
	HealthBar.prototype.setActor = function(actor) {
		this._actor = actor;
	};
	HealthBar.prototype.show = function() {
		this._isHidden = false;
	};
	HealthBar.prototype.hide = function() {
		this._isHidden = true;
	};
	return HealthBar;
});