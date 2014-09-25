if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Tile',
	'game/Constants',
	'game/SpriteSheet',
	'game/Rect'
], function(
	Tile,
	Constants,
	SpriteSheet,
	Rect
) {
	var FRAMES = [ 0, 7, 15, 11, 1, 4, 12, 8, 3, 6, 14, 10, 2, 5, 13, 9 ];
	var SPRITE = new SpriteSheet('/image/tile-spritesheet.gif', 2, 18, 18);
	function SquareTile(tiles, col, row, frame) {
		Tile.apply(this, arguments);
		this.box = new Rect(this.col * Constants.TILE_SIZE, this.row * Constants.TILE_SIZE,
			Constants.TILE_SIZE, Constants.TILE_SIZE);
		/*if(frameName === 'upper') { this._renderFrame = 5; }
		else if(frameName === 'lower') { this._renderFrame = 13; }
		else if(frameName === 'left') { this._renderFrame = 8; }
		else if(frameName === 'right') { this._renderFrame = 10; }
		else if(frameName === 'upper-left') { this._renderFrame = 4; }
		else if(frameName === 'upper-right') { this._renderFrame = 6; }
		else if(frameName === 'lower-left') { this._renderFrame = 12; }
		else if(frameName === 'lower-right') { this._renderFrame = 14; }
		else if(frameName === 'center') { this._renderFrame = 9; }
		else { this._renderFrame = 0; }*/
		this._renderFrame = (typeof frame === 'number' ? frame : 0);
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	SquareTile.prototype.render = function(ctx, camera) {
		SPRITE.render(ctx, camera, this.col * Constants.TILE_SIZE - 6, this.row * Constants.TILE_SIZE - 6, this._renderFrame);
	};
	return SquareTile;
});