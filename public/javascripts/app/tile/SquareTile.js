if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Tile'
], function(
	Tile
) {
	function SquareTile(tiles, col, row) {
		Tile.apply(this, arguments);
		this.box = {
			x: this.col * this.TILE_SIZE,
			y: this.row * this.TILE_SIZE,
			width: this.TILE_SIZE,
			height: this.TILE_SIZE
		};
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	return SquareTile;
});