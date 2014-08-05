if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/Player',
	'app/Level'
], function(
	$,
	Player,
	Level
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600, isPaused = false;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//create stuff
		var player = new Player(1000, 1000);
		var camera = { x: player.pos.x, y: player.pos.y };
		var level = new Level();

		//add input bindings
		var keys = { pressed: {} };
		var KEY = { W: 87, A: 65, S: 83, D: 68, R: 82, P: 80, G: 71, SHIFT: 16, SPACE: 32 };
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
			//player.applyForce(0, 600); //gravity
			if(keys[KEY.A]) { player.applyForce(-400, 0); }
			if(keys[KEY.D]) { player.applyForce(400, 0); }
			if(keys[KEY.W]) { player.applyForce(0, -400); }
			if(keys[KEY.S]) { player.applyForce(0, 400); }
			player.move(ms);

			//find mid-frame collisions
			var interruption = findInterruption();
			var interruptionKeysAlreadyUsed = [];
			for(var i = 0; i < 100 && interruption; i++) {
				if(interruptionKeysAlreadyUsed.indexOf(interruption.key) !== -1) {
					player.interruptRemainingMovement();
					break;
				}
				interruptionKeysAlreadyUsed.push(interruption.key);
				player.handleInterruption(interruption);
				interruption = findInterruption(interruption.key);
			}

			//if we find waaaay too many collisions, that means the player is stuck (in a good way) between obstacles
			if(i === 100) {
				player.interruptRemainingMovement();
			}
		}

		function findInterruption(prohibitedInterruptionKey) {
			var interruptions = [];

			//find any potential collisions with obstacles this frame
			for(var i = 0; i < level.obstacles.length; i++) {
				var interruption = level.obstacles[i].checkForCollisionWithPlayer(player);
				if(interruption && interruption.key !== prohibitedInterruptionKey) {
					interruptions.push(interruption);
				}
			}

			//we only need to handle the first collision right now
			interruptions.sort(function(a, b) { return a.squareDistTo - b.squareDistTo; });
			return interruptions[0] || null;
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			level.render(ctx, camera);
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