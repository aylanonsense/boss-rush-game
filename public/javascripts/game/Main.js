if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'game/Player',
	'game/Constants',
	'game/geom/Triangle',
	'game/level/Level1'
], function(
	$,
	Player,
	Constants,
	Triangle,
	Level
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600;
		var IS_EDITING_MAP = false;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" ' +
			'style="display:block;margin: 15Px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');
		var mapEditLastDraggedOver = null;
		var startOfDrag = null;

		//init stuff
		var player = new Player(0, 0);
		var grapples = [];
		var camera = { x: 0, y: 0 };
		var level = new Level(player);

		//the main game loop
		function tick() {
			//everything moves before the player
			for(var i = 0; i < grapples.length; i++) {
				if(!grapples[i].isDead) {
					grapples[i].move();
					grapples[i].checkForCollisions(level.tileGrid);
				}
			}

			//then the player moves
			var moveDirX = keys[MOVE_KEYS.LEFT] ? -1 : (keys[MOVE_KEYS.RIGHT] ? 1 : 0);
			var moveDirY = keys[MOVE_KEYS.UP] ? -1 : (keys[MOVE_KEYS.DOWN] ? 1 : 0);
			player.planMovement(moveDirX, moveDirY);
			while(player.hasMovementRemaining()) {
				//move the player forward a bit
				player.move();
				player.checkForCollisions(level.tileGrid);
			}

			//then the grapples may affect the player -- outside the loop above for simplicity
			for(i = 0; i < grapples.length; i++) {
				if(!grapples[i].isDead) {
					grapples[i].applyForceToPlayer();
				}
			}
			player.checkForCollisions(level.tileGrid);
			player.tick();

			//the camera adjusts to follow the player
			camera.x = Math.round(player.pos.x - WIDTH / 2);
			camera.y = Math.round(player.pos.y - HEIGHT / 2 - 0.12 * HEIGHT);
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			level.tileGrid.render(ctx, camera);
			for(var i = 0; i < grapples.length; i++) {
				if(!grapples[i].isDead) {
					grapples[i].render(ctx, camera);
				}
			}
			player.render(ctx, camera);
		}

		//add input bindings
		var keys = { pressed: {} };
		var MOVE_KEYS = {
			UP: 87, //W
			LEFT: 65, //A
			DOWN: 83, //S
			RIGHT: 68 //D
		};
		var SUPER_BOOST_KEYS = {
			UP: 73, //I
			LEFT: 74, //J
			DOWN: 75, //K
			RIGHT: 76 //L
		};
		var JUMP_KEY = 32; //SPACE
		var PULL_GRAPPLE_KEY = 16; //SHIFT
		var MAP_EDIT_KEY = 85; //U
		var SAVE_MAP_KEY = 72; //H
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === MAP_EDIT_KEY) { IS_EDITING_MAP = !IS_EDITING_MAP; }
				if(evt.which === SAVE_MAP_KEY) { Level.tileGrid.saveToMap(); }
				if(evt.which === JUMP_KEY) { player.jump(); }
				if(evt.which === SUPER_BOOST_KEYS.UP) { player.vel.y = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.DOWN) { player.vel.y = 999999; }
				if(evt.which === SUPER_BOOST_KEYS.LEFT) { player.vel.x = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.RIGHT) { player.vel.x = 999999; }
				if(evt.which === PULL_GRAPPLE_KEY) {
					for(var i = 0; i < grapples.length; i++) {
						if(!grapples[i].isDead) {
							grapples[i].startRetracting();
						}
					}
				}
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				keys.pressed[evt.which] = false;
				if(evt.which === JUMP_KEY) { player.stopJumping(); }
				if(evt.which === PULL_GRAPPLE_KEY) {
					grapples = [];
				}
			}
		});
		$(document).on('mousedown', function(evt) {
			if(IS_EDITING_MAP) {
				var x = evt.offsetX + camera.x;
				var y = evt.offsetY + camera.y;
				var row = Math.floor(y / Constants.TILE_SIZE);
				var col = Math.floor(x / Constants.TILE_SIZE);
				if(evt.altKey) {
					removeBlock(row, col);
				}
				else if(evt.shiftKey) {
					startOfDrag = { row: row, col: col };
				}
				else {
					addBlock(row, col);
				}
				mapEditLastDraggedOver = { row: row, col: col };
			}
			else {
				var numMissedGrapples = 0;
				for(var i = 0; i < grapples.length; i++) {
					if(!grapples[i].isDead && !grapples[i].isLatched) {
						numMissedGrapples++;
					}
				}
				if(numMissedGrapples === 0) {
					grapples = [];
					var grapple = player.shootGrapple(evt.offsetX + camera.x, evt.offsetY + camera.y);
					if(keys[PULL_GRAPPLE_KEY]) {
						grapple.startRetracting();
					}
					grapples.push(grapple);
				}
			}
		});
		$(document).on('mouseup', function(evt) {
			if(IS_EDITING_MAP) {
				mapEditLastDraggedOver = null;
				if(startOfDrag) {
					var x = evt.offsetX + camera.x;
					var y = evt.offsetY + camera.y;
					var row = Math.floor(y / Constants.TILE_SIZE);
					var col = Math.floor(x / Constants.TILE_SIZE);
					var rowMin = Math.min(row, startOfDrag.row);
					var rowMax = Math.max(row, startOfDrag.row);
					var colMin = Math.min(col, startOfDrag.col);
					var colMax = Math.max(col, startOfDrag.col);
					for(var r = rowMin; r <= rowMax; r++) {
						for(var c = colMin; c <= colMax; c++) {
							var frame = 10;
							if(r === rowMin && r === rowMax) { frame -= 8; }
							else if(r === rowMin) { frame -= 4; }
							else if(r === rowMax) { frame += 4; }
							if(c === colMin && c === colMax) { frame -= 2; }
							else if(c === colMin) { frame -= 1; }
							else if(c === colMax) { frame += 1; }
							addBlock(r, c, frame);
						}
					}
					startOfDrag = null;
				}
			}
		});
		$(document).on('mousemove', function(evt) {
			if(IS_EDITING_MAP && mapEditLastDraggedOver) {
				var x = evt.offsetX + camera.x;
				var y = evt.offsetY + camera.y;
				var row = Math.floor(y / Constants.TILE_SIZE);
				var col = Math.floor(x / Constants.TILE_SIZE);
				if(mapEditLastDraggedOver.row !== row || mapEditLastDraggedOver.col !== col) {
					if(evt.altKey) {
						removeBlock(row, col);
					}
					else if(!startOfDrag) {
						addBlock(row, col);
					}
					mapEditLastDraggedOver = { row: row, col: col };
				}
			}
		});

		function addBlock(row, col, frame) {
			//return Level.tileGrid.add(new SquareTile(Level.tileGrid, col, row, frame));
		}
		function removeBlock(row, col) {
			//Level.tileGrid.remove(row, col);
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