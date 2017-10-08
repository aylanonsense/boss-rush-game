if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'game/Player',
	'game/Constants',
	'game/level/Level1'
], function(
	$,
	Player,
	Constants,
	Level
) {
	return function() {
		//canvas
		var canvas = $('<canvas width="' + Constants.WIDTH + 'px" height = "' + Constants.HEIGHT + 'px" ' +
			' />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//init stuff
		var player = new Player(0, 0);
		var grapples = [];
		var camera = { x: 0, y: 0 };
		var level = new Level();
		player.pos.x = level.playerStartPoint.x;
		player.pos.y = level.playerStartPoint.y;

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
			camera.x = Math.round(player.pos.x - Constants.WIDTH / 2);
			camera.y = Math.round(player.pos.y - Constants.HEIGHT / 2 - 0.12 * Constants.HEIGHT);
		}

		function render() {
			ctx.fillStyle = '#fff';
			ctx.fillRect(0, 0, Constants.WIDTH, Constants.HEIGHT);
			level.backgroundTileGrid.render(ctx, camera);
			level.tileGrid.render(ctx, camera);
			for(var i = 0; i < level.obstacles.length; i++) {
				level.obstacles[i].render(ctx, camera);
			}
			for(i = 0; i < grapples.length; i++) {
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
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
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
				if(evt.which === JUMP_KEY) { player.stopJumping(); }
				if(evt.which === PULL_GRAPPLE_KEY) { grapples = []; }
			}
		});
		$(document).on('mousedown', function(evt) {
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