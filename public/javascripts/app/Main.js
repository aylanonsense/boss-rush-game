if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/Player',
	'app/TileGrid',
	'app/tile/SquareTile'
], function(
	$,
	Player,
	TileGrid,
	SquareTile
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" ' +
			'style="display:block;margin: 15Px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//init stuff
		var isPaused = false;
		var player = new Player(-700, 0);
		var grapples = [];
		var camera = { x: player.pos.x, y: player.pos.y };
		var tiles = new TileGrid();

		//create tiles
		var tileCoords = [];
		tileCoords.push({ xMin: -40, xMax: 1, yMin: 1, yMax: 1 });
		tileCoords.push({ xMin: 2, xMax: 4, yMin: 0, yMax: 0 });
		tileCoords.push({ xMin: -35, xMax: -31, yMin: -12, yMax: -12 });
		tileCoords.push({ xMin: -20, xMax: -16, yMin: -12, yMax: -12 });
		tileCoords.push({ xMin: -44, xMax: -44, yMin: -5, yMax: 30 });
		tileCoords.push({ xMin: -41, xMax: -41, yMin: -2, yMax: 0 });
		tileCoords.push({ xMin: 2, xMax: 2, yMin: -7, yMax: -4 });
		tileCoords.push({ xMin: 5, xMax: 5, yMin: -1, yMax: -1 });
		tileCoords.push({ xMin: 5, xMax: 5, yMin: -4, yMax: -3 });
		for(var i = 0; i < tileCoords.length; i++) {
			for(var x = tileCoords[i].xMin; x <= tileCoords[i].xMax; x++) {
				for(var y = tileCoords[i].yMin; y <= tileCoords[i].yMax; y++) {
					tiles.add(new SquareTile(tiles, x, y));
				}
			}
		}

		//the main game loop
		function tick() {
			//everything moves before the player
			for(var i = 0; i < grapples.length; i++) {
				grapples[i].move();
				grapples[i].checkForCollisions(tiles);
			}

			//then the player moves
			var moveDirX = keys[MOVE_KEYS.LEFT] ? -1 : (keys[MOVE_KEYS.RIGHT] ? 1 : 0);
			var moveDirY = keys[MOVE_KEYS.UP] ? -1 : (keys[MOVE_KEYS.DOWN] ? 1 : 0);
			player.planMovement(moveDirX, moveDirY);
			while(player.hasMovementRemaining()) {
				//move the player forward a bit
				player.move();
				player.checkForCollisions(tiles);
			}

			//then the grapples may affect the player -- outside the loop above for simplicity
			player.checkForMaxTetherRange(grapples);
			player.checkForCollisions(tiles);

			//the camera adjusts to follow the player
			camera.x = player.pos.x - WIDTH / 2;
			camera.y = player.pos.y - HEIGHT / 2 - 0.12 * HEIGHT;
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			tiles.render(ctx, camera);
			for(var i = 0; i < grapples.length; i++) {
				grapples[i].render(ctx, camera);
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
		var BREAK_GRAPPLE_KEY = 82; //L
		var PULL_GRAPPLE_KEY = 16; //SHIFT
		var PAUSE_KEY = 80; //P
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === PAUSE_KEY) { isPaused = !isPaused; }
				if(evt.which === JUMP_KEY) { player.jump(); }
				if(evt.which === SUPER_BOOST_KEYS.UP) { player.vel.y = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.DOWN) { player.vel.y = 999999; }
				if(evt.which === SUPER_BOOST_KEYS.LEFT) { player.vel.x = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.RIGHT) { player.vel.x = 999999; }
				if(evt.which === BREAK_GRAPPLE_KEY) { grapples = []; }
				if(evt.which === PULL_GRAPPLE_KEY) {
					for(var i = 0; i < grapples.length; i++) {
						grapples[i].startRetracting();
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
					for(var i = 0; i < grapples.length; i++) {
						grapples[i].stopRetracting();
					}
				}
			}
		});
		$(document).on('click', function(evt) {
			grapples.push(player.shootGrapple(evt.offsetX + camera.x, evt.offsetY + camera.y));
		});

		//set up animation frame functionality
		function loop() {
			if(!isPaused) {
				tick();
			}
			render();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	};
});