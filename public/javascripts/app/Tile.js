if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function Tile(tileWorld, col, row) {
		this.TILE_SIZE = 40;
		this._tileWorld = tileWorld;
		this.row = row;
		this.col = col;
		this.box = null;
	}
	Tile.prototype.render = function(ctx, camera) {
		ctx.strokeStyle = '#aaa';
		ctx.lineWidth = 0.5;
		ctx.beginPath();
		ctx.rect(this.col * this.TILE_SIZE - camera.x, this.row * this.TILE_SIZE - camera.y, this.TILE_SIZE, this.TILE_SIZE);
		ctx.stroke();
	};
	return Tile;
});