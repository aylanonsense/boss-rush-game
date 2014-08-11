if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
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
	TileGrid.prototype.render = function(ctx, camera) {
		this.forEach(function(tile) {
			tile.render(ctx, camera);
		});
	};
	return TileGrid;
});