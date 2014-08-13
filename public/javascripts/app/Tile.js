if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Constants',
], function(
	Constants
) {
	function Tile(tileWorld, col, row) {
		this._tileWorld = tileWorld;
		this.row = row;
		this.col = col;
		this.box = null;
	}
	Tile.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#aaa';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.rect(this.col * Constants.TILE_SIZE - camera.x,
			this.row * Constants.TILE_SIZE - camera.y,
			Constants.TILE_SIZE, Constants.TILE_SIZE);
		ctx.stroke();
	};
	return Tile;
});