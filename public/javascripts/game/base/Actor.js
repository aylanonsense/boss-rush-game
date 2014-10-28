if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global'
], function(
	Global
) {
	var NEXT_ACTOR_ID = 0;
	function Actor(level, x, y) {
		this._actorId = NEXT_ACTOR_ID++;
		this.width = 0;
		this.height = 0;
		this.level = level;
		this.pos = { x: x || 0, y: y || 0 };
		this.vel = { x: 0, y: 0 };
		this.MAX_HORIZONTAL_MOVEMENT_PER_TICK = 10;
		this.MAX_VERTICAL_MOVEMENT_PER_TICK = 10;
		this.isCollidable = false;
		this._hitboxes = [];
		this._hurtboxes = [];
		this.platform = null;
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
		return true;
	};
	Actor.prototype.planMovement = function() {
		this._finalPos = {
			x: this.pos.x + this.vel.x / 60,
			y: this.pos.y + this.vel.y / 60
		};
		this._recalculateCollisionBoxes();
	};
	Actor.prototype.hasMovementRemaining = function() {
		return this.pos.x !== this._finalPos.x || this.pos.y !== this._finalPos.y;
	};
	Actor.prototype.move = function() {
		var dx = this._finalPos.x - this.pos.x;
		var dy = this._finalPos.y - this.pos.y;
		var percentOfMaxHorizontalMovement = Math.abs(dx) / this.MAX_HORIZONTAL_MOVEMENT_PER_TICK;
		var percentOfMaxVerticalMovement = Math.abs(dy) / this.MAX_VERTICAL_MOVEMENT_PER_TICK;
		var percentOfMaxMovement = Math.max(percentOfMaxHorizontalMovement, percentOfMaxVerticalMovement);
		if(percentOfMaxMovement > 1.0) {
			this.pos.x += dx / percentOfMaxMovement;
			this.pos.y += dy / percentOfMaxMovement;
		}
		else {
			this.pos.x = this._finalPos.x;
			this.pos.y = this._finalPos.y;
		}
		this._recalculateCollisionBoxes();
	};
	Actor.prototype.finishMovement = function() {
		this._recalculateHitBoxes();
	};
	Actor.prototype._recalculateHitBoxes = function() {
		//to be implemented in subclasses
	};
	Actor.prototype._recalculateCollisionBoxes = function() {
		this._recalculateCenter();
	};
	Actor.prototype._recalculateCenter = function() {
		this.center = { x: this.pos.x + this.width / 2, y: this.pos.y + this.height / 2 };
	};
	Actor.prototype.render = function(ctx, camera) {
		if(Global.DEBUG_MODE) {
			ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
			if(this.width > 0 && this.height > 0) {
				ctx.fillRect(this.pos.x - camera.x, this.pos.y - camera.y, this.width, this.height);
			}
		}
		else if(Global.DEV_MODE) {
			//draw hitboxes and hurtboxes
			var color;
			for(var i = 0; i < this._hurtboxes.length; i++) {
				if(this._hurtboxes[i].type === 'enemy') { color = 'rgba(255, 255, 50, 0.6)'; }
				else if(this._hurtboxes[i].type === 'shatter') { color = 'rgba(50, 255, 255, 0.6)'; }
				else { color = 'rgba(255, 0, 0, 0.6)'; }
				this._hurtboxes[i].shape.render(ctx, camera, color);
			}
			for(i = 0; i < this._hitboxes.length; i++) {
				if(this._hitboxes[i].type === 'enemy') { color = 'rgb(255, 255, 50)'; }
				else if(this._hitboxes[i].type === 'shatter') { color = 'rgb(50, 255, 255)'; }
				else { color = 'rgb(255, 0, 0)'; }
				this._hitboxes[i].shape.render(ctx, camera, color, true, 3);
			}

			//draw platform (solid ground)
			if(this.platform) {
				this.platform.render(ctx, camera, '#f06', true, 3);
			}
		}
		if(Global.DEV_MODE || Global.DEBUG_MODE) {
			ctx.strokeStyle = '#fff';
			ctx.lineWidth = 1;

			//draw position
			if(this.width >= 5 && this.height >= 5) {
				ctx.beginPath();
				ctx.moveTo(this.pos.x - camera.x, this.pos.y + 5 - camera.y);
				ctx.lineTo(this.pos.x - camera.x, this.pos.y - camera.y);
				ctx.lineTo(this.pos.x + 5 - camera.x, this.pos.y - camera.y);
				ctx.stroke();
			}

			//draw center
			ctx.beginPath();
			ctx.moveTo(this.center.x - camera.x - 5, this.center.y - camera.y);
			ctx.lineTo(this.center.x - camera.x + 5, this.center.y - camera.y);
			ctx.moveTo(this.center.x - camera.x, this.center.y - camera.y - 5);
			ctx.lineTo(this.center.x - camera.x, this.center.y - camera.y + 5);
			ctx.stroke();
		}
	};
	Actor.prototype.sameAs = function(actor) {
		return this._actorId === actor._actorId;
	};
	Actor.prototype.checkForCollisions = function() {
		//to be implemented in subclasses
	};
	Actor.prototype.startOfFrame = function() {
		//to be implemented in subclasses
	};
	Actor.prototype.endOfFrame = function() {
		//to be implemented in subclasses
	};

	//helper functions
	function sortByHighestPriority(a, b) {
		return Math.max(b.hurtbox.priority, b.hitbox.priority) -
				Math.max(a.hurtbox.priority, a.hitbox.priority);
	}

	return Actor;
});