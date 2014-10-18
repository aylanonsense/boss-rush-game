if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Hitbox(params) {
		this.enabled = true;
		this.type = (params && params.type) || null;
		this.priority = (params && params.priority) || 3;
		this.shape = (params && params.shape) || null;
		this._onHitCallback = (params && params.onHit) || null;
	}
	Hitbox.prototype.isHitting = function(hitbox) {
		//hitboxes only register hits if they share a type
		if(this.enabled && hitbox.enabled && this.type === hitbox.type) {
			return this.shape.isOverlapping(hitbox.shape);
		}
		return false;
	};
	Hitbox.prototype.onHit = function(actor, handled) {
		if(this._onHitCallback) {
			return this._onHitCallback(actor, handled, this) || false;
		}
		return false;
	};

	//helper functions
	function sortByHighestPriority(a, b) {
		return Math.max(b.hurtbox.priority, b.hitbox.priority) -
				Math.max(a.hurtbox.priority, a.hitbox.priority);
	}

	return Hitbox;
});