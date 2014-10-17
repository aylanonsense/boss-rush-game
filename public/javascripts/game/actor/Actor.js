if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants',
	'game/geom/Rect',
	'game/display/SpriteLoader'
], function(
	Constants,
	Rect,
	SpriteLoader
) {
	function Actor(level) {
		this._level = level;
		this._isAlive = true;
		this.health = 10;
		this._hitboxes = [];
		this._hurtboxes = [];
	}
	Actor.prototype.checkForHitting = function(actor) {
		//dead actors don't tell no tales (or hit each other)
		if(this.isAlive() && actor.isAlive()) {
			var hits = [];
			//find all hurtboxes that are hitting the actor's hitboxes
			for(var i = 0; i < this._hurtboxes.length; i++) {
				for(var j = 0; j < actor._hitboxes.length; j++) {
					if(this._hurtboxes[i].isHitting(actor._hitboxes[j])) {
						hits.push({ hurtbox: this._hurtboxes[i], hitbox: actor._hitboxes[j] });
					}
				}
			}
			//register each of those as a hit, in priority order
			if(hits.length > 0) {
				hits.sort(sortByHighestPriority);
				for(i = 0; i < hits.length; i++) {
					if(hits[i].hurtbox.priority >= hits[i].hitbox.priority) {
						hits[i].hitbox.onHit(this, hits[i].hurtbox.onHit(actor, false));
					}
					else {
						hits[i].hurtbox.onHit(actor, hits[i].hitbox.onHit(this, false));
					}
				}
				return true;
			}
		}
		return false;
	};
	Actor.prototype.isAlive = function() {
		return this._isAlive;
	};
	Actor.prototype.startOfFrame = function() {
		//TODO
	};
	Actor.prototype.planMovement = function() {
		//TODO
	};
	Actor.prototype.hasMovementRemaining = function() {
		//TODO
	};
	Actor.prototype.move = function() {
		//TODO
	};
	Actor.prototype.endOfFrame = function() {
		if(this.health <= 0) {
			this._isAlive = false;
		}
		//TODO
	};
	Actor.prototype.render = function(ctx, camera) {
		//TODO
	};

	//helper functions
	function sortByHighestPriority(a, b) {
		return Math.max(b.hurtbox.priority, b.hitbox.priority) -
				Math.max(a.hurtbox.priority, a.hitbox.priority);
	}

	return Actor;
});