if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'app/Constants'
], function(
	Constants
) {
	function TileGrid() {
		this._tiles = {};
		this._tiles.minRow = null;
		this._tiles.maxRow = null;
	}
	TileGrid.prototype.add = function(tile) {
		if(this._tiles.minRow === null || tile.row < this._tiles.minRow) {
			this._tiles.minRow = tile.row;
		}
		if(this._tiles.maxRow === null || tile.row > this._tiles.maxRow) {
			this._tiles.maxRow = tile.row;
		}
		if(!this._tiles[tile.row]) {
			this._tiles[tile.row] = {
				minCol: tile.col,
				maxCol: tile.col
			};
		}
		else {
			if(tile.col < this._tiles[tile.row].minCol) {
				this._tiles[tile.row].minCol = tile.col;
			}
			else if(tile.col > this._tiles[tile.row].maxCol) {
				this._tiles[tile.row].maxCol = tile.col;
			}
		}
		this._tiles[tile.row][tile.col] = tile;
	};
	TileGrid.prototype.forEach = function(callback) {
		if(this._tiles.minRow !== null) {
			for(var r = this._tiles.minRow; r <= this._tiles.maxRow; r++) {
				if(this._tiles[r]) {
					for(var c = this._tiles[r].minCol; c <= this._tiles[r].maxCol; c++) {
						if(this._tiles[r][c]) {
							callback(this._tiles[r][c]);
						}
					}
				}
			}
		}
	};
	TileGrid.prototype.forEachNearby = function(rect, callback) {
		var rowOfRectTop = Math.floor(rect.y / Constants.TILE_SIZE);
		var rowOfRectBottom = Math.floor((rect.y + rect.height) / Constants.TILE_SIZE);
		var colOfRectLeft = Math.floor(rect.x / Constants.TILE_SIZE);
		var colOfRectRight = Math.floor((rect.x + rect.width) / Constants.TILE_SIZE);
		for(var r = rowOfRectTop; r <= rowOfRectBottom; r++) {
			for(var c = colOfRectLeft; c <= colOfRectRight; c++) {
				if(this._tiles[r] && this._tiles[r][c]) {
					callback(this._tiles[r][c]);
				}
			}
		}
	};
	TileGrid.prototype.render = function(ctx, camera) {
		this.forEach(function(tile) {
			tile.render(ctx, camera);
		});
	};
	return TileGrid;
});