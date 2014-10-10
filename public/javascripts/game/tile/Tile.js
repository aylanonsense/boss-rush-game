if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Constants',
	'game/geom/Rect',
	'game/geom/Triangle',
	'game/display/SpriteLoader'
], function(
	Constants,
	Rect,
	Triangle,
	SpriteLoader
) {
	var T = Constants.TILE_SIZE; //for convenience
	function Tile(col, row, tile, frame, variant) {
		this.col = col;
		this.row = row;
		this.walkSlope = 0;
		var shapeKey = 'box';
		//select the correct shape to represent the tile
		if(frame === 23) { //upper half brick
			this._shape = new Rect(T * this.col, T * this.row, T, T / 2, '#000');
		}
		else if(frame === 27) { //lower half brick
			this._shape = new Rect(T * this.col, T * (this.row + 0.5), T, T / 2, '#000');
		}
		else if(frame === 16) { //triangle \|
			this._shape = new Triangle(T * this.col, T * this.row, T, T, 'upper-right', '#000');
		}
		else if(frame === 17) { //triangle |/
			this._shape = new Triangle(T * this.col, T * this.row, T, T, 'upper-left', '#000');
		}
		else if(frame === 18) { //triangle /|
			this.walkSlope = 1;
			this._shape = new Triangle(T * this.col, T * this.row, T, T, 'lower-right', '#000');
		}
		else if(frame === 19) { //triangle |\
			this.walkSlope = -1;
			this._shape = new Triangle(T * this.col, T * this.row, T, T, 'lower-left', '#000');
		}
		else if(frame === 20) { //1st part of /| ramp
			this.walkSlope = 1 / 3;
			this._shape = new Triangle(T * this.col, T * (this.row + 2 / 3), T, T / 3, 'lower-right', '#000');
		}
		else if(frame === 21) { //2nd part of /| ramp
			this.walkSlope = 1 / 3;
			this._shape = new Triangle(T * this.col, T * (this.row + 1 / 3), T, T / 3, 'lower-right', '#000');
		}
		else if(frame === 22) { //3rd part of /| ramp
			this.walkSlope = 1 / 3;
			this._shape = new Triangle(T * this.col, T * this.row, T, T / 3, 'lower-right', '#000');
		}
		else if(frame === 26) { //1st part of |\ ramp
			this.walkSlope = -1 / 3;
			this._shape = new Triangle(T * this.col, T * (this.row + 2 / 3), T, T / 3, 'lower-left', '#000');
		}
		else if(frame === 25) { //2nd part of |\ ramp
			this.walkSlope = -1 / 3;
			this._shape = new Triangle(T * this.col, T * (this.row + 1 / 3), T, T / 3, 'lower-left', '#000');
		}
		else if(frame === 24) { //3rd part of |\ ramp
			this.walkSlope = -1 / 3;
			this._shape = new Triangle(T * this.col, T * this.row, T, T / 3, 'lower-left', '#000');
		}
		else { //box
			this._shape = new Rect(T * this.col, T * this.row, T, T, '#000');
		}
		//intialize display vars (spritesheet)
		if(tile && tile.sprite) {
			this._sprite = SpriteLoader.loadSpriteSheet(tile.sprite);
			this._frame = (frame || 0) + 28 * (variant || 0);
		}
	}
	Tile.prototype.isOverlapping = function(geom) {
		return this._shape.isOverlapping(geom);
	};
	Tile.prototype.isCrossedBy = function(line) {
		return line.isCrossing(this._shape);
	};
	Tile.prototype.render = function(ctx, camera) {
		if(this._sprite) {
			this._sprite.render(ctx, T * this.col - Constants.TILE_DISPLAY_PADDING - camera.x,
				T * this.row - Constants.TILE_DISPLAY_PADDING - camera.y, this._frame);
		}
		if(Constants.DEBUG || !this._sprite) {
			this._shape.render(ctx, camera);
		}
	};
	return Tile;
});