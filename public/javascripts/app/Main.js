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
		var player = new Player(-700, 0);
		var grapple = null;
		var camera = { x: 0, y: 0 };
		var tiles = new TileGrid();

		//create tiles
		var tileCoords = [];
		//horizontal
		tileCoords.push({ xMin: -41, xMax: 2, yMin: 1, yMax: 1 });
		tileCoords.push({ xMin: -32, xMax: -5, yMin: 2, yMax: 2 });
		tileCoords.push({ xMin: -30, xMax: -26, yMin: 3, yMax: 3 });
		tileCoords.push({ xMin: 2, xMax: 6, yMin: 0, yMax: 0 });
		tileCoords.push({ xMin: -35, xMax: -31, yMin: -12, yMax: -12 });
		tileCoords.push({ xMin: -20, xMax: -16, yMin: -12, yMax: -12 });
		tileCoords.push({ xMin: -28, xMax: -25, yMin: -3, yMax: -3 });
		//vertical
		tileCoords.push({ xMin: -44, xMax: -44, yMin: -5, yMax: 30 });
		tileCoords.push({ xMin: -41, xMax: -41, yMin: -2, yMax: 0 });
		tileCoords.push({ xMin: 2, xMax: 2, yMin: -7, yMax: -4 });
		tileCoords.push({ xMin: 5, xMax: 5, yMin: -1, yMax: -1 });
		tileCoords.push({ xMin: 5, xMax: 5, yMin: -4, yMax: -3 });
		//individual
		tileCoords.push({ xMin: -3, xMax: -3, yMin: -8, yMax: -8 });
		tileCoords.push({ xMin: -6, xMax: -6, yMin: -12, yMax: -12 });
		tileCoords.push({ xMin: -6, xMax: -6, yMin: -9, yMax: -9 });
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
			if(grapple && !grapple.isDead) {
				grapple.move();
				grapple.checkForCollisions(tiles);
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

			//then the grapple may affect the player -- outside the loop above for simplicity
			if(grapple && !grapple.isDead) {
				grapple.applyForceToPlayer();
			}
			player.checkForCollisions(tiles);
			player.tick();

			//the camera adjusts to follow the player
			camera.x = Math.round(player.pos.x - WIDTH / 2);
			camera.y = Math.round(player.pos.y - HEIGHT / 2 - 0.12 * HEIGHT);
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			tiles.render(ctx, camera);
			if(grapple && !grapple.isDead) {
				grapple.render(ctx, camera);
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
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === JUMP_KEY) { player.jump(); }
				if(evt.which === SUPER_BOOST_KEYS.UP) { player.vel.y = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.DOWN) { player.vel.y = 999999; }
				if(evt.which === SUPER_BOOST_KEYS.LEFT) { player.vel.x = -999999; }
				if(evt.which === SUPER_BOOST_KEYS.RIGHT) { player.vel.x = 999999; }
				if(evt.which === BREAK_GRAPPLE_KEY) {
					if(!grapple || grapple.isDead || grapple.isLatched) {
						grapple = null;
					}
				}
				if(evt.which === PULL_GRAPPLE_KEY) {
					if(grapple && !grapple.isDead) {
						grapple.startRetracting();
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
					if(grapple && grapple.isLatched) {
						grapple = null;
					}
				}
			}
		});
		$(document).on('mousedown', function(evt) {
			if(!grapple || grapple.isLatched || grapple.isDead) {
				grapple = player.shootGrapple(evt.offsetX + camera.x, evt.offsetY + camera.y);
				if(keys[PULL_GRAPPLE_KEY]) {
					grapple.startRetracting();
				}
			}
		});

		//set up animation frame functionality
		function loop() {
			tick();
			render();
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);
	};
});