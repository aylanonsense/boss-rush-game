if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants'
], function(
	Constants
) {
	return {
		TILE_SYMBOL: 'M',
		PLAYER_SYMBOL: 'p',
		tiles:	"      MM      \n" +
				"       M      \n" +
				"       M      \n" +
				"              \n" +
				"             M\n" +
				"             M\n" +
				"             M\n" +
				"             M\n" +
				"              \n" +
				"              \n" +
				"     p        \n" +
				"MMMMMMMMMMM   \n" +
				"  MMMMMMM     \n" +
				"   MMMMM      \n" +
				"   MMMM       ",
		frames:	"      04      \n" +
				"       8      \n" +
				"       C      \n" +
				"              \n" +
				"             4\n" +
				"             8\n" +
				"             8\n" +
				"             C\n" +
				"              \n" +
				"              \n" +
				"              \n" +
				"01357575700   \n" +
				"  0DFDFDF     \n" +
				"   57130      \n" +
				"   DF00       ",
		getFrame: function(i) {
			var frame = this.frames[i].charCodeAt(0);
			if(frame >= 65) {
				frame -= 7;
			}
			return frame - 48;
		},
		encodeGrid: function(grid, player) {
			var playerCol = Math.floor((player.pos.x + player.width/2) / Constants.TILE_SIZE);
			var playerRow = Math.floor((player.pos.y + player.height/2) / Constants.TILE_SIZE);
			var minRow = playerRow;
			var maxRow = playerRow;
			var minCol = playerCol;
			var maxCol = playerCol;
			var tiles = [];
			grid.forEach(function(tile) {
				if(minRow === null || tile.row < minRow) { minRow = tile.row; }
				if(minCol === null || tile.col < minCol) { minCol = tile.col; }
				if(maxRow === null || tile.row > maxRow) { maxRow = tile.row; }
				if(maxCol === null || tile.col > maxCol) { maxCol = tile.col; }
				if(!tiles[tile.row]) {
					tiles[tile.row] = [];
				}
				tiles[tile.row][tile.col] = tile;
			});
			var tileString = "";
			var frameString = "";
			var playerPos = {
				row: 0,
				col: 0
			};
			for(var r = minRow; r <= maxRow; r++) {
				for(var c = minCol; c <= maxCol; c++) {
					if(playerRow === r && playerCol === c) {
						tileString += "p";
						frameString += " ";
					}
					else if(tiles[r] && tiles[r][c]) {
						var frame = tiles[r][c]._renderFrame + 48;
						if(frame > 57) { frame += 7; }
						tileString += "M";
						frameString += "" + String.fromCharCode(frame);
					}
					else {
						tileString += " ";
						frameString += " ";
					}
				}
				if(r < maxRow) {
					tileString += "\n";
					frameString += "\n";
				}
			}
			console.log('\t\ttiles:\t"' + tileString.replace(/\n/g, '\\n" +\n\t\t\t\t"') +
				'",\n\t\tframes:\t"' + frameString.replace(/\n/g, '\\n" +\n\t\t\t\t"') + '",');
		}
	};
});