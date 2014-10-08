if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/tile/Tile',
	'game/config/level-config',
	'game/Constants'
], function(
	Tile,
	config,
	Constants
) {
	var T = Constants.TILE_SIZE;
	function TileGrid() {
		this._tiles = { minRow: null, maxRow: null };
	}
	TileGrid.prototype.loadFromMap = function(shapes, sprites, frames) {
		for(var r = 0; r < shapes.length; r++) {
			for(var c = 0; c < shapes[r].length; c++) {
				var shape = config.shapeLegend[shapes[r][c]] || null;
				var sprite = (sprites && sprites[r] && sprites[r][c] && config.spriteLegend[sprites[r][c]]) || null;
				var frame = (frames && frames[r] && frames[r][c] && charToFrameNum(frames[r][c])) || null;
				if(shape) {
					this.add(new Tile(c, r, shape, sprite, frame));
				}
			}
		}
	};
	TileGrid.prototype.saveToMap = function() {
		//TODO
	};
	TileGrid.prototype.get = function(col, row) {
		return (this._tiles[row] && this._tiles[row][col]) || null;
	};
	TileGrid.prototype.remove = function(col, row) {
		if(this._tiles[row] && this._tiles[row][col]) {
			//we don't clean up the min/max row/col, but that's perfectly fine
			delete this._tiles[row][col];
		}
	};
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
		return tile;
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
		var rowOfRectTop = Math.floor(rect.y / T);
		var rowOfRectBottom = Math.floor((rect.y + rect.height) / T);
		var colOfRectLeft = Math.floor(rect.x / T);
		var colOfRectRight = Math.floor((rect.x + rect.width) / T);
		for(var r = rowOfRectTop; r <= rowOfRectBottom; r++) {
			for(var c = colOfRectLeft; c <= colOfRectRight; c++) {
				if(this._tiles[r] && this._tiles[r][c]) {
					callback(this._tiles[r][c]);
				}
			}
		}
	};
	TileGrid.prototype.render = function(ctx, camera, drawGridLines) {
		if(drawGridLines) {
			ctx.strokeStyle ='#eee';
			ctx.lineWidth = 1;
			for(var x = T * Math.floor(camera.x / T); x <= T * Math.floor((camera.x + Constants.WIDTH) / T); x += T) {
				ctx.beginPath();
				ctx.moveTo(x - camera.x, -1);
				ctx.lineTo(x - camera.x, Constants.HEIGHT + 1);
				ctx.stroke();
			}
			for(var y = T * Math.floor(camera.y / T); y <= T * Math.floor((camera.y + Constants.HEIGHT) / T); y += T) {
				ctx.beginPath();
				ctx.moveTo(-1, y - camera.y);
				ctx.lineTo(Constants.WIDTH + 1, y - camera.y);
				ctx.stroke();
			}
		}
		this.forEach(function(tile) {
			tile.render(ctx, camera);
		});
	};

	//helper functions
	function charToFrameNum(c) {
		var frame = c.charCodeAt(0);
		return (frame > 64 ? frame - 55 : frame - 48);
	}
	function frameNumToChar(frame) {
		return String.fromCharCode((frame > 9 ? frame + 55 : frame + 48));
	}

	return TileGrid;
});