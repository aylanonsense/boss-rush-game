if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/display/SpriteLoader',
	'game/Constants'
], function(
	SpriteLoader,
	Constants
) {
	var HUD_WIDTH = 200;
	var HUD_PADDING = 20;
	var HUD_SPACING = 10;
	var DIRT_TILE_SPRITE = SpriteLoader.loadSpriteSheet('DIRT-TILE');
	function LevelEditorHUD() {
		this._selectedIndex = 0;
		this._selectables = [
			{ sprite: DIRT_TILE_SPRITE, shape: 'box', frame: 0 },
			{ sprite: DIRT_TILE_SPRITE, shape: 'box', frame: 3 }
		];
		//place tile sprites in a grid
		var x = Constants.WIDTH - HUD_WIDTH + HUD_PADDING;
		var y = HUD_PADDING;
		var rowHeight = 0;
		for(var i = 0; i < this._selectables.length; i++) {
			if(x + this._selectables[i].sprite.width > Constants.WIDTH - HUD_PADDING) {
				x = Constants.WIDTH - HUD_WIDTH + HUD_PADDING;
				y += rowHeight + HUD_SPACING;
				rowHeight = 0;
			}
			rowHeight = Math.max(rowHeight, this._selectables[i].sprite.height);
			this._selectables[i].x = x;
			this._selectables[i].y = y;
			x += this._selectables[i].sprite.width + HUD_SPACING;
		}
	}
	LevelEditorHUD.prototype.render = function(ctx, camera) {
		var leftX = Constants.WIDTH - HUD_WIDTH;
		//draw white background of the HUD
		ctx.fillStyle = '#fff';
		ctx.fillRect(leftX, 0, Constants.WIDTH, Constants.HEIGHT);
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.moveTo(leftX, 0);
		ctx.lineTo(leftX, Constants.HEIGHT);
		ctx.stroke();
		//draw tile sprites
		for(var i = 0; i < this._selectables.length; i++) {
			if(i === this._selectedIndex) {
				ctx.fillStyle = '#f00';
				ctx.fillRect(this._selectables[i].x - 1, this._selectables[i].y - 1,
					this._selectables[i].sprite.width + 2, this._selectables[i].sprite.height + 2);
			}
			this._selectables[i].sprite.render(ctx, this._selectables[i].x,
				this._selectables[i].y, this._selectables[i].frame);
		}
	};
	LevelEditorHUD.prototype.handleMouseEvent = function(evt, finishDrag) {
		var x = evt.offsetX;
		var y = evt.offsetY;
		if(x > Constants.WIDTH - HUD_WIDTH) {
			for(var i = 0; i < this._selectables.length; i++) {
				if(this._selectables[i].x <= x && x <= this._selectables[i].x + this._selectables[i].sprite.width &&
					this._selectables[i].y <= y && y <= this._selectables[i].y + this._selectables[i].sprite.height) {
					this._selectedIndex = i;
					break;
				}
			}
			return true;
		}
		return false;
	};
	LevelEditorHUD.prototype.getTileType = function() {
		return {
			shape: this._selectables[this._selectedIndex].shape,
			sprite: this._selectables[this._selectedIndex].sprite.key,
			frame: this._selectables[this._selectedIndex].frame
		};
	};
	return LevelEditorHUD;
});