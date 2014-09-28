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
	var T = Constants.TILE_SIZE; //for convenience
	function Tile(col, row, shape, spriteKey, frame) {
		this.col = col;
		this.row = row;
		//select the correct rect to represent the tile
		if(shape === 'upper-half') {
			this.rect = new Rect(T * this.col, T * this.row, T, T / 2, '#000');
		}
		else if(shape === 'lower-half') {
			this.rect = new Rect(T * this.col, T * (this.row + 0.5), T, T / 2, '#000');
		}
		else {
			this.rect = new Rect(T * this.col, T * this.row, T, T, '#000');
		}
		//intialize display vars (spritesheet)
		if(spriteKey) {
			this._sprite = SpriteLoader.loadSpriteSheet(spriteKey);
			this._frame = frame || 0;
		}
	}
	Tile.prototype.isCrossedByLine = function(line) {
		return line.isCrossingRect(this.rect);
	};
	Tile.prototype.render = function(ctx, camera) {
		if(this._sprite) {
			this._sprite.render(ctx, T * this.col - Constants.TILE_DISPLAY_PADDING - camera.x,
				T * this.row - Constants.TILE_DISPLAY_PADDING - camera.y, this._frame);
		}
		else {
			this.rect.render(ctx, camera);
		}
	};
	return Tile;
});