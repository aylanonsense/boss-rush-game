if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Tile'
], function(
	Tile
) {
	function SquareTile(tiles, row, col) {
		Tile.apply(this, arguments);
	}
	SquareTile.prototype = Object.create(Tile.prototype);
	return SquareTile;
});