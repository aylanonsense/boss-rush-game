if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/TilePlayer',
	'app/TileWorld',
	'app/tile/SquareTile'
], function(
	$,
	Player,
	TileWorld,
	SquareTile
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600, isPaused = false;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//create stuff
		var player = new Player(0, 0);
		var camera = { x: player.pos.x, y: player.pos.y };
		var tiles = new TileWorld();
		tiles.add(new SquareTile(tiles, -2, 3));
		tiles.add(new SquareTile(tiles, -1, 3));
		tiles.add(new SquareTile(tiles, 0, 3));
		tiles.add(new SquareTile(tiles, -1, 1));
		tiles.add(new SquareTile(tiles, 0, 1));
		tiles.add(new SquareTile(tiles, 1, 1));
		tiles.add(new SquareTile(tiles, 2, 1));
		tiles.add(new SquareTile(tiles, 3, 0));
		tiles.add(new SquareTile(tiles, 4, 0));

		//add input bindings
		var keys = { pressed: {} };
		var KEY = { W: 87, A: 65, S: 83, D: 68, R: 82, P: 80, G: 71, SHIFT: 16, SPACE: 32 };
		var JUMP_KEY = KEY.SPACE;
		var PAUSE_KEY = KEY.P;
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === PAUSE_KEY) {
					isPaused = !isPaused;
				}
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				keys.pressed[evt.which] = false;
			}
		});

		//important stuff that happens every frame
		function tick(ms) {
			var i, j;

			//move the player
			player.applyForce(0, 600); //gravity
			if(keys[KEY.A]) { player.applyForce(-400, 0); }
			if(keys[KEY.D]) { player.applyForce(400, 0); }
			if(keys[KEY.W]) { player.applyForce(0, -400); }
			if(keys[KEY.S]) { player.applyForce(0, 400); }
			player.tick(ms);
			player.checkForCollisions(tiles);
		}

		function findInterruption(prohibitedInterruptionKey) {
			var interruptions = [];

			return interruptions[0] || null;
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			tiles.render(ctx, camera);
			player.render(ctx, camera);
		}

		function everyFrame(ms) {
			if(!isPaused) {
				tick(ms);
				camera.x = player.pos.x - WIDTH / 2;
				camera.y = player.pos.y - HEIGHT / 2;
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