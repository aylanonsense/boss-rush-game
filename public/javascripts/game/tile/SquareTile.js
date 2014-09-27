if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/tile/Tile',
	'game/Constants',
	'game/display/SpriteLoader',
	'game/geom/Rect'
], function(
	Tile,
	Constants,
	SpriteLoader,
	Rect
) {
	var FRAMES = [ 0, 7, 15, 11, 1, 4, 12, 8, 3, 6, 14, 10, 2, 5, 13, 9 ];
	var SPRITE = SpriteLoader.loadSpriteSheet('DIRT-TILE');
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
		SPRITE.render(ctx, this.col * Constants.TILE_SIZE - 6 - camera.x, this.row * Constants.TILE_SIZE - 6 - camera.y, this._renderFrame);
	};
	return SquareTile;
});