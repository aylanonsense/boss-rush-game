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
		var WIDTH = 800, HEIGHT = 600, isPaused = false;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" ' +
			'style="display:block;margin: 15Px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//create stuff
		var player = new Player(-700, 0);
		var grapples = [];
		var camera = { x: player.pos.x, y: player.pos.y };
		var tiles = new TileGrid();
		for(var i = -5; i <= 30; i++) {
			tiles.add(new SquareTile(tiles, -44, i));
		}
		tiles.add(new SquareTile(tiles, -41, -2));
		tiles.add(new SquareTile(tiles, -41, -1));
		tiles.add(new SquareTile(tiles, -41, 0));
		for(i = -40; i <= 1; i++) {
			tiles.add(new SquareTile(tiles, i, 1));
		}
		tiles.add(new SquareTile(tiles, 2, 0));
		tiles.add(new SquareTile(tiles, 3, 0));
		tiles.add(new SquareTile(tiles, 4, 0));
		tiles.add(new SquareTile(tiles, 5, -1));
		tiles.add(new SquareTile(tiles, 5, -3));
		tiles.add(new SquareTile(tiles, 5, -4));
		tiles.add(new SquareTile(tiles, 2, -4));
		tiles.add(new SquareTile(tiles, 2, -5));
		tiles.add(new SquareTile(tiles, 2, -6));
		tiles.add(new SquareTile(tiles, 2, -7));
		for(i = -35; i <= -31; i++) {
			tiles.add(new SquareTile(tiles, i, -12));
		}
		for(i = -20; i <= -16; i++) {
			tiles.add(new SquareTile(tiles, i, -12));
		}

		//add input bindings
		var keys = { pressed: {} };
		var KEY = { W: 87, A: 65, S: 83, D: 68, R: 82, P: 80, G: 71, SHIFT: 16, SPACE: 32 };
		var JUMP_KEY = KEY.SPACE;
		var PAUSE_KEY = KEY.P;
		var SUPER_BOOST_KEY = KEY.SHIFT;
		var BREAK_GRAPPLE_KEY = KEY.R;
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === PAUSE_KEY) {
					isPaused = !isPaused;
				}
				if(evt.which === JUMP_KEY) {
					player.jump();
				}
				if(evt.which === SUPER_BOOST_KEY) {
					if(player._moveDir.x !== 0 || player._moveDir.y !== 0) {
						player.vel.x = 9999999 * player._moveDir.x;
						player.vel.y = 9999999 * player._moveDir.y;
					}
				}
				if(evt.which === BREAK_GRAPPLE_KEY) {
					grapples = [];
				}
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				keys.pressed[evt.which] = false;
				if(evt.which === JUMP_KEY) {
					player.stopJumping();
				}
			}
		});
		$(document).on('click', function(evt) {
			grapples.push(player.shootGrapple(evt.offsetX + camera.x, evt.offsetY + camera.y));
		});

		//important stuff that happens every frame
		function tick(ms) {
			//move the player
			player.setMoveDir(keys[KEY.A] ? -1 : (keys[KEY.D] ? 1 : 0), keys[KEY.W] ? -1 : (keys[KEY.S] ? 1 : 0));
			player.tick(tiles);

			//move grapples
			for(var i = 0; i < grapples.length; i++) {
				grapples[i].tick(tiles);
			}
		}

		function findInterruption(prohibitedInterruptionKey) {
			var interruptions = [];

			return interruptions[0] || null;
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

		function everyFrame(ms) {
			if(!isPaused) {
				tick(ms);
				camera.x = player.pos.x - WIDTH / 2;
				camera.y = player.pos.y - HEIGHT / 2 - 0.12 * HEIGHT;
			}
			render();
		}

		//set up animation frame functionality
		var prevTime;
		requestAnimationFrame(function(time) {
			prevTime = time;
			loop(time);
		});
		function loop(time) {
			var ms = time - prevTime;
			prevTime = time;
			everyFrame(ms, time);
			requestAnimationFrame(loop);
		}
	};
});