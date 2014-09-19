if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Tile',
	'app/Constants',
	'app/SpriteSheet',
	'app/Rect'
], function(
	Tile,
	Constants,
	SpriteSheet,
	Rect
) {
	var SPRITE = new SpriteSheet('/image/tile-parts-spritesheet.gif', 2, 10, 10);
	function SquareTile(tiles, col, row) {
		Tile.apply(this, arguments);
		this.box = new Rect(this.col * Constants.TILE_SIZE, this.row * Constants.TILE_SIZE,
			Constants.TILE_SIZE, Constants.TILE_SIZE);
		this._renderFrames = null;
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	SquareTile.prototype.render = function(ctx, camera) {
		if(this._renderFrames === null) {
			this._renderFrames = { lowerLeft: 4, lowerRight: 4, upperLeft: 4, upperRight: 4 };
			if(!this._tiles.get(this.row, this.col - 1)) { //tile to the left
				this._renderFrames.lowerLeft -= 1;
				this._renderFrames.upperLeft -= 1;
			}
			if(!this._tiles.get(this.row, this.col + 1)) { //tile to the right
				this._renderFrames.lowerRight += 1;
				this._renderFrames.upperRight += 1;
			}
			if(!this._tiles.get(this.row - 1, this.col)) { //tile above
				this._renderFrames.upperLeft -= 3;
				this._renderFrames.upperRight -= 3;
			}
			if(!this._tiles.get(this.row + 1, this.col)) { //tile below
				this._renderFrames.lowerLeft += 3;
				this._renderFrames.lowerRight += 3;
			}
			if(this._renderFrames.lowerRight === 4 && !this._tiles.get(this.row + 1, this.col + 1)) {
				this._renderFrames.lowerRight = 9;
			}
			if(this._renderFrames.lowerLeft === 4 && !this._tiles.get(this.row + 1, this.col - 1)) {
				this._renderFrames.lowerLeft = 12;
			}
			if(this._renderFrames.upperRight === 4 && !this._tiles.get(this.row - 1, this.col + 1)) {
				this._renderFrames.upperRight = 10;
			}
			if(this._renderFrames.upperLeft === 4 && !this._tiles.get(this.row - 1, this.col - 1)) {
				this._renderFrames.upperLeft = 11;
			}
		}
		SPRITE.render(ctx, camera, this.col * Constants.TILE_SIZE - 4, this.row * Constants.TILE_SIZE + 8, this._renderFrames.lowerLeft);
		SPRITE.render(ctx, camera, this.col * Constants.TILE_SIZE + 8, this.row * Constants.TILE_SIZE + 8, this._renderFrames.lowerRight);
		SPRITE.render(ctx, camera, this.col * Constants.TILE_SIZE - 4, this.row * Constants.TILE_SIZE - 4, this._renderFrames.upperLeft);
		SPRITE.render(ctx, camera, this.col * Constants.TILE_SIZE + 8, this.row * Constants.TILE_SIZE - 4, this._renderFrames.upperRight);
		//Tile.prototype.render.apply(this, arguments);
	};
	return SquareTile;
});