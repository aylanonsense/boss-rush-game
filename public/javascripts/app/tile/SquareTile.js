if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Tile',
	'app/Constants'
], function(
	Tile,
	Constants
) {
	function SquareTile(tiles, col, row) {
		Tile.apply(this, arguments);
		this.box = {
			x: this.col * Constants.TILE_SIZE,
			y: this.row * Constants.TILE_SIZE,
			width: Constants.TILE_SIZE,
			height: Constants.TILE_SIZE
		};
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	return SquareTile;
});