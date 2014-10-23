if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global',
	'game/base/FullCollisionActor',
	'game/base/Hitbox',
	'game/geom/Rect',
	'game/levels/ElementalRoyalty/IceBlock',
	'game/display/SpriteLoader'
], function(
	Global,
	FullCollisionActor,
	Hitbox,
	Rect,
	IceBlock,
	SpriteLoader
) {
	var SUPERCLASS = FullCollisionActor;
	var SPRITE = SpriteLoader.loadSpriteSheet('MAIL');
	var FALLOFF_DIST = 170;
	function MailProjectile(level, x, y) {
		SUPERCLASS.call(this, level, x + 50, y);
		this._frame = 0;
		this.vel.x = 350;
		this._isAlive = true;
		this._startingPosX = this.pos.x;
		this._isSlowingDown = false;
		this._isFluttering = false;
		this._isBlinkingOutOfExistence = false;
	}
	MailProjectile.prototype = Object.create(SUPERCLASS.prototype);
	MailProjectile.prototype.startOfFrame = function() {
		SUPERCLASS.prototype.startOfFrame.call(this);
		this._frame++;
		if(this._isBlinkingOutOfExistence) {
			this.vel.x = 0;
			this.vel.y = 0;
			this._framesSpentBlinkingOutOfExistence++;
			if(this._framesSpentBlinkingOutOfExistence > 40) {
				this._isAlive = false;
			}
		}
		else if(this._isFluttering) {
			this._framesSpentFluttering++;
			this.vel.x = 10;
			this.vel.y = 20;
			this.pos.x -= this._mailFlutterDiff;
			this._mailFlutterDiff = 30 * Math.sin(Math.PI * (this._framesSpentFluttering) / 70);
			this.pos.x += this._mailFlutterDiff;
			if(this._framesSpentFluttering > this._flutterFrames) {
				this._isBlinkingOutOfExistence = true;
				this._framesSpentBlinkingOutOfExistence = 0;
			}
		}
		else if(this._isSlowingDown) {
			this.vel.x *= 0.85;
			this._framesSpentSlowingDown++;
			if(this._framesSpentSlowingDown > 5) {
				this._isAlive = false;
				this._isFluttering = true;
				this._framesSpentFluttering = 0;
				this._flutterFrames = 120 + 40 * Math.random();
				this._mailFlutterDiff = 0;
			}
		}
		if(Math.abs(this.pos.x - this._startingPosX) > FALLOFF_DIST && !this._isSlowingDown) {
			this._isSlowingDown = true;
			this._framesSpentSlowingDown = 0;
		}
	};
	MailProjectile.prototype.render = function(ctx, camera) {
		if(!Global.DEBUG_MODE) {
			var frame;
			if(this._isBlinkingOutOfExistence || this._isFluttering) {
				if(this._mailFlutterDiff > 25) {
					frame = 7;
				}
				else if(this._mailFlutterDiff < 5 && this._framesSpentFluttering > 10) {
					frame = 5;
				}
				else {
					frame = 6;
				}
				if(this._isBlinkingOutOfExistence && this._framesSpentBlinkingOutOfExistence % 10 < 3) {
					frame = null;
				}
			}
			else if(this._frame < 10) {
				frame = 0;
			}
			else if(this._frame < 18) {
				frame = 1;
			}
			else if(this._frame < 26) {
				frame = 2;
			}
			else {
				frame = ((this._frame - 26) % 16 < 8 ? 3 : 4);
			}
			if(frame !== null) {
			SPRITE.render(ctx, camera, this.pos.x, this.pos.y, frame, false);
		}
		}
		SUPERCLASS.prototype.render.call(this, ctx, camera);
	};
	MailProjectile.prototype._recalculateCollisionBoxes = function() {
		SUPERCLASS.prototype._recalculateCollisionBoxes.call(this);
		//this._createCollisionBoxes(0, 0, 28, 36);
	};
	MailProjectile.prototype._recalculateHitBoxes = function() {
		/*this._hitboxes = [
			new Hitbox({ type: 'player', shape: new Rect(this.pos.x + 2, this.pos.y + 2, 24, 32) })
		];*/
		SUPERCLASS.prototype._recalculateHitBoxes.call(this);
	};
	MailProjectile.prototype.finishMovement = function() {
		SUPERCLASS.prototype.finishMovement.apply(this, arguments);
	};
	MailProjectile.prototype.isAlive = function() {
		return this._isAlive;
	};
	return MailProjectile;
});