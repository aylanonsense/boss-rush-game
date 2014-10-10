if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'game/level/LevelEditorHUD',
	'game/Constants',
	'game/tile/Tile',
	'game/level/Level1'
], function(
	$,
	LevelEditorHUD,
	Constants,
	Tile,
	Level
) {
	return function() {
		//canvas
		var canvas = $('<canvas width="' + Constants.WIDTH + 'px" height = "' + Constants.HEIGHT + 'px" ' +
			'style="display:block;margin: 15px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');
		var lastMousedOver = null;
		var mouseDown = false;
		var startOfDrag = null;
		var removeDragged = false;
		var hudIsHandlingMouseEvent = false;

		//init stuff
		var camera = { x: 0, y: -Math.floor(Constants.HEIGHT / 4) };
		var level = new Level();
		var hud = new LevelEditorHUD();

		//the main game loop
		function tick() {
			var moveDirX = keys[MOVE_KEYS.LEFT] ? -1 : (keys[MOVE_KEYS.RIGHT] ? 1 : 0);
			var moveDirY = keys[MOVE_KEYS.UP] ? -1 : (keys[MOVE_KEYS.DOWN] ? 1 : 0);
			camera.x += moveDirX * 10;
			camera.y += moveDirY * 10;
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);
			level.backgroundTileGrid.render(ctx, camera, true);
			level.tileGrid.render(ctx, camera);
			if(startOfDrag && lastMousedOver) {
				ctx.strokeStyle = '#f00';
				ctx.lineWidth = 1;
				ctx.strokeRect(Math.min(startOfDrag.col, lastMousedOver.col) * Constants.TILE_SIZE - camera.x,
					Math.min(startOfDrag.row, lastMousedOver.row) * Constants.TILE_SIZE - camera.y,
					(Math.abs(startOfDrag.col - lastMousedOver.col) + 1) * Constants.TILE_SIZE,
					(Math.abs(startOfDrag.row - lastMousedOver.row) + 1) * Constants.TILE_SIZE);
			}
			hud.render(ctx, camera);
		}

		//add input bindings
		var keys = { pressed: {} };
		var MOVE_KEYS = {
			UP: 87, //W
			LEFT: 65, //A
			DOWN: 83, //S
			RIGHT: 68 //D
		};
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
			}
		});
		canvas.on('mousedown', function(evt) {
			handleMouseEvent(evt);
		});
		canvas.on('mouseup', function(evt) {
			handleMouseEvent(evt, true);
		});
		canvas.on('mousemove', function(evt) {
			if(mouseDown) {
				handleMouseEvent(evt);
			}
		});

		function handleMouseEvent(evt, finishDrag) {
			var x = evt.offsetX + camera.x;
			var y = evt.offsetY + camera.y;
			var col = Math.floor(x / Constants.TILE_SIZE);
			var row = Math.floor(y / Constants.TILE_SIZE);
			//always triggered by a mousedown event:
			if(!mouseDown) {
				mouseDown = true;
				if(evt.shiftKey) {
					startOfDrag = { row: row, col: col };
					removeDragged = evt.altKey;
				}
				if(hud.handleMouseEvent(evt, finishDrag)) {
					hudIsHandlingMouseEvent = true;
				}
			}
			if(hudIsHandlingMouseEvent) {
				hud.handleMouseEvent(evt, finishDrag);
			}
			//if you aren't shift-dragging, operate on the current block
			else if(!startOfDrag && (!lastMousedOver || lastMousedOver.col !== col || lastMousedOver.row !== row)) {
				if(evt.altKey) {
					removeBlock(col, row);
				}
				else {
					addBlock(col, row, 0);
				}
			}
			//always triggered by a mouseup event:
			if(finishDrag) {
				//if you are shift dragging, operate on the selected rectangle of tiles
				if(startOfDrag && !hudIsHandlingMouseEvent) {
					var colMin = Math.min(startOfDrag.col, lastMousedOver.col);
					var colMax = Math.max(startOfDrag.col, lastMousedOver.col);
					var rowMin = Math.min(startOfDrag.row, lastMousedOver.row);
					var rowMax = Math.max(startOfDrag.row, lastMousedOver.row);
					for(var c = colMin; c <= colMax; c++) {
						for(var r = rowMin; r <= rowMax; r++) {
							if(removeDragged) {
								removeBlock(c, r);
							}
							else {
								var frameOffset = 10;
								if(c === colMin && c === colMax) { frameOffset -= 2; }
								else if(c === colMin) { frameOffset -= 1; }
								else if(c === colMax) { frameOffset += 1; }
								if(r === rowMin && r === rowMax) { frameOffset -= 8; }
								else if(r === rowMin) { frameOffset -= 4; }
								else if(r === rowMax) { frameOffset += 4; }
								addBlock(c, r, frameOffset);
							}
						}
					}
				}
				mouseDown = false;
				startOfDrag = null;
				lastMousedOver = null;
				hudIsHandlingMouseEvent = false;
			}
			else {
				lastMousedOver = { col: col, row: row };
			}
		}
		function addBlock(col, row, frameOffset) {
			var tileType = hud.getTileType();
			var frame = hud.getFrame();
			var grid = (tileType.background ? level.backgroundTileGrid : level.tileGrid);
			if(frameOffset !== 0) {
				frame = 0;
			}
			if(typeof frame !== 'number') {
				grid.add(new Tile(col - 1, row, tileType, frame[0]));
				grid.add(new Tile(col, row, tileType, frame[1]));
				grid.add(new Tile(col + 1, row, tileType, frame[2]));
			}
			else {
				grid.add(new Tile(col, row, tileType, frame + frameOffset));
			}
		}
		function removeBlock(col, row) {
			level.backgroundTileGrid.remove(col, row);
			level.tileGrid.remove(col, row);
		}

		//set up animation frame functionality
		function loop() {
			tick();
			render();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	};
});