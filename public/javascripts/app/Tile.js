if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Tile(tileWorld, row, col) {
		this.TILE_SIZE = 50;
		this._tileWorld = tileWorld;
		this.row = row;
		this.col = col;
	}
	Tile.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#aaa';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.rect(this.row * this.TILE_SIZE - camera.x, this.col * this.TILE_SIZE - camera.y, this.TILE_SIZE, this.TILE_SIZE);
		ctx.stroke();
	};
	return Tile;
});