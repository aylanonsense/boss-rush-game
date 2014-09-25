if (typeof define !== 'function') { var define = require('amdefine')(module); }
define(function() {
	function SpriteSheet(imagePath, scale, spriteWidth, spriteHeight, defaultColor) {
		var self = this;
		this._scaledImageCanvas = null;
		this._flippedImageCanvas = null;
		this._imageLoaded = false;
		this._color = defaultColor || '#fbb';
		this._spriteWidth = scale * spriteWidth;
		this._spriteHeight = scale * spriteHeight;

		//load the image
		var img = new Image();
		img.onload = function() {
			var tempCanvas = document.createElement('canvas');
			tempCanvas.width = this.width;
			tempCanvas.height = this.height;
			var tempCtx = tempCanvas.getContext('2d');
			tempCtx.drawImage(this, 0, 0);
			var sourceData = tempCtx.getImageData(0, 0, this.width, this.height).data;
			self._scaledImageCanvas = document.createElement('canvas');
			self._scaledImageCanvas.width = this.width * scale;
			self._scaledImageCanvas.height = 2 * this.height * scale;
			var tempCtx2 = self._scaledImageCanvas.getContext('2d');
			var offset = 0;
			for (var y = 0; y < this.height; ++y) {
				for (var x = 0; x < this.width; ++x) {
					var r = sourceData[offset++];
					var g = sourceData[offset++];
					var b = sourceData[offset++];
					var a = sourceData[offset++] / 100.0;
					tempCtx2.fillStyle = 'rgba(' + [r, g, b, a].join(',') + ')';
					tempCtx2.fillRect(x * scale, y * scale, scale, scale);
					//fill the flipped pixel too
					tempCtx2.fillRect(self._scaledImageCanvas.width - (x + 1) * scale,
						self._scaledImageCanvas.height / 2 + y * scale, scale, scale);
				}
			}
			self._imageLoaded = true;
		};
		img.src = imagePath;
	}
	SpriteSheet.prototype.render = function(ctx, camera, x, y, frame, flip) {
		if(this._imageLoaded) {
			var numCols = this._scaledImageCanvas.width / this._spriteWidth;
			var numRows = (this._scaledImageCanvas.height / this._spriteHeight) / 2;
			var frameX = frame % numCols;
			var frameY = Math.floor(frame / numCols);
			if(flip) {
				frameX = numCols - frameX - 1;
				frameY += numRows;
			}
			ctx.drawImage(this._scaledImageCanvas,
				frameX * this._spriteWidth,
				frameY * this._spriteHeight,
				this._spriteWidth,
				this._spriteHeight,
				x - camera.x,
				y - camera.y,
				this._spriteWidth,
				this._spriteHeight
			);
		}
		else {
			ctx.fillStyle = this._color;
			ctx.fillRect(x - camera.x, y - camera.y, this._spriteWidth, this._spriteHeight);
		}
	};
	return SpriteSheet;
});