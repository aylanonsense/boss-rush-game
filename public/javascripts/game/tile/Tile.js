if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants',
	'game/geom/Rect',
	'game/geom/Triangle',
	'game/display/SpriteLoader'
], function(
	Constants,
	Rect,
	Triangle,
	SpriteLoader
) {
	var T = Constants.TILE_SIZE; //for convenience
	function Tile(col, row, shape, spriteKey, frame) {
		this.col = col;
		this.row = row;
		this.walkSlope = 0;
		//select the correct shape to represent the tile
		if(shape === 'upper-half') {
			this._shape = new Rect(T * this.col, T * this.row, T, T / 2, '#000');
		}
		else if(shape === 'lower-half') {
			this._shape = new Rect(T * this.col, T * (this.row + 0.5), T, T / 2, '#000');
		}
		else if(shape === 'triangle-lower-left') {
			this.walkSlope = -1;
			this._shape = new Triangle(T * this.col, T * this.row, T, T, 'lower-left', '#000');
		}
		else {
			this._shape = new Rect(T * this.col, T * this.row, T, T, '#000');
		}
		//intialize display vars (spritesheet)
		if(spriteKey) {
			this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
			this._frame = frame || 0;
		}
	}
	Tile.prototype.isIntersectingRect = function(rect) {
		return this._shape.isIntersectingRect(rect);
	};
	Tile.prototype.isCrossedByLine = function(line) {
		return line.isCrossingRect(this._shape);
	};
	Tile.prototype.render = function(ctx, camera) {
		if(this._sprite) {
			this._sprite.render(ctx, T * this.col - Constants.TILE_DISPLAY_PADDING - camera.x,
				T * this.row - Constants.TILE_DISPLAY_PADDING - camera.y, this._frame);
		}
		else {
			this._shape.render(ctx, camera);
		}
	};
	return Tile;
});