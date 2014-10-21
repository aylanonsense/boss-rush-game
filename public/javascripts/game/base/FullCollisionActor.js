if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/Actor',
	'game/geom/Rect'
], function(
	Global,
	Actor,
	Rect
) {
	var SUPERCLASS = Actor;
	function FullCollisionActor(level, x, y) {
		SUPERCLASS.call(this, level, x, y);
		this.isCollidable = true;
	}
	FullCollisionActor.prototype = Object.create(SUPERCLASS.prototype);
	FullCollisionActor.prototype._createCollisionBoxes = function(offsetX, offsetY, width, height) {
		this._collisionBoxOffsetX = offsetX;
		this._collisionBoxOffsetY = offsetY;
		var x = this.pos.x + offsetX;
		var y = this.pos.y + offsetY;
		var xIndent = Math.max(2, Math.floor(width / 10)); //TODO
		var yIndent = Math.max(2, Math.floor(height / 10)); //TODO
		if(yIndent <= xIndent) {
			xIndent = yIndent - 1;
		}
		if(width <= 4 || height <= 4) {
			throw new Error("Unsure how to support collision boxes smaller than 4px");
		}
		this._topCollisionBox = new Rect(x + xIndent, y, width - 2 * xIndent, height / 2);
		this._bottomCollisionBox = new Rect(x + xIndent, y + height / 2, width - 2 * xIndent, height / 2);
		this._leftCollisionBox = new Rect(x, y + yIndent, width / 2, height - 2 * yIndent);
		this._rightCollisionBox = new Rect(x + width / 2, y + yIndent, width / 2, height - 2 * yIndent);
		this._boundingCollisionBox = new Rect(x, y, width, height);
		this.MAX_HORIZONTAL_MOVEMENT_PER_TICK = xIndent;
		this.MAX_VERTICAL_MOVEMENT_PER_TICK = yIndent;
	};
	FullCollisionActor.prototype.checkForCollisions = function(tileGrid, obstacles) {
		var self = this;
		var overlap;

		//move actor up, above any tiles or obstacles it is intersecting
		tileGrid.forEachNearby(this._boundingCollisionBox, function(tile) {
			self._checkForBottomCollisions(tile);
		});
		for(var i = 0; i < obstacles.length; i++) {
			self._checkForBottomCollisions(obstacles[i]);
		}

		//now move the actor out of any obstacles it may have been moved into
		tileGrid.forEachNearby(this._boundingCollisionBox, function(tile) {
			self._checkForNonBottomCollisions(tile);
		});
		for(i = 0; i < obstacles.length; i++) {
			self._checkForNonBottomCollisions(obstacles[i]);
		}
	};
	FullCollisionActor.prototype._checkForBottomCollisions = function(thing) {
		var overlap = this._bottomCollisionBox && thing.isOverlapping(this._bottomCollisionBox);
		if(overlap) {
			if(!thing.oneWayPlatform || this.vel.y >= 0) { //TODO this may cause the actor to "snap"
				this.pos.y = overlap.top - this._boundingCollisionBox.height - this._collisionBoxOffsetY;
				if(this.vel.y >= 0) {
					this._finalPos.y = this.pos.y;
				}
				this._onCollided(thing, 'bottom');
				this._recalculateCollisionBoxes();
			}
		}
	};
	FullCollisionActor.prototype._checkForNonBottomCollisions = function(thing) {
		if(!thing.oneWayPlatform) {
			//left collision box
			var overlap = this._leftCollisionBox && thing.isOverlapping(this._leftCollisionBox);
			if(overlap) {
				this.pos.x = overlap.right - this._collisionBoxOffsetX;
				if(this.vel.x <= 0) {
					this._finalPos.x = this.pos.x;
				}
				this._onCollided(thing, 'left');
				this._recalculateCollisionBoxes();
			}

			//right collision box
			overlap = this._rightCollisionBox && thing.isOverlapping(this._rightCollisionBox);
			if(overlap) {
				this.pos.x = overlap.left - this._boundingCollisionBox.width - this._collisionBoxOffsetX;
				if(this.vel.x >= 0) {
					this._finalPos.x = this.pos.x;
				}
				this._onCollided(thing, 'right');
				this._recalculateCollisionBoxes();
			}

			//top collision box (hitting your head on a platform)
			overlap = this._topCollisionBox && thing.isOverlapping(this._topCollisionBox);
			if(overlap) {
				this.pos.y = overlap.bottom - this._collisionBoxOffsetY;
				if(this.vel.y <= 0) {
					this._finalPos.y = this.pos.y;
				}
				this._onCollided(thing, 'top');
				this._recalculateCollisionBoxes();
			}
		}
	};
	FullCollisionActor.prototype._recalculateCollisionBoxes = function() {
		this._topCollisionBox = null;
		this._bottomCollisionBox = null;
		this._leftCollisionBox = null;
		this._rightCollisionBox = null;
		this._boundingCollisionBox = null;
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
	};
	FullCollisionActor.prototype._onCollided = function(thing, dir) {};
	FullCollisionActor.prototype.render = function(ctx, camera) {
		if(this._boundingCollisionBox) {
			if(Global.DEBUG_MODE) {
				this._boundingCollisionBox.render(ctx, camera, '#090');
			}
			else if(Global.DEV_MODE) {
				this._boundingCollisionBox.render(ctx, camera, '#ff0', true);
			}
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	return FullCollisionActor;
});