if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/Player',
	'app/EditableLevel'
], function(
	$,
	Player,
	EditableLevel
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//create stuff
		var level = new EditableLevel();
		var player = new Player(level.startingPoint.x, level.startingPoint.y);
		var camera = { x: player.pos.x, y: player.pos.y };

		//add input bindings
		var keys = { pressed: {} };
		var KEY = { W: 87, A: 65, S: 83, D: 68, R: 82, P: 80, G: 71, Z: 90, X: 88, C: 67, V: 86, SHIFT: 16, SPACE: 32 };
		var CREATE_POLY_KEY = KEY.C;
		var CREATE_LINES_KEY = KEY.X;
		var UNDO_KEY = KEY.Z;
		var EXPORT_KEY = KEY.V;
		var isCreatingPoly = false;
		var isCreatingLines = false;
		var newPolyPoints = [];
		var mouse = { x: 0, y: 0 };
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				keys.pressed[evt.which] = true;
				if(evt.which === CREATE_POLY_KEY) {
					isCreatingPoly = true;
				}
				if(evt.which === CREATE_LINES_KEY) {
					isCreatingLines = true;
				}
				if(evt.which === UNDO_KEY) {
					level.deleteLastCreatedPoly();
				}
				if(evt.which === EXPORT_KEY) {
					level.exportLevel();
				}
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				keys.pressed[evt.which] = false;
				if(evt.which === CREATE_POLY_KEY) {
					isCreatingPoly = false;
					if(newPolyPoints.length > 2) {
						newPolyPoints.push(newPolyPoints[0]);
						newPolyPoints.push(newPolyPoints[1]);
						level.createPoly(newPolyPoints);
					}
					newPolyPoints = [];
				}
				if(evt.which === CREATE_LINES_KEY) {
					isCreatingLines = false;
					if(newPolyPoints.length > 2) {
						level.createPoly(newPolyPoints);
					}
					newPolyPoints = [];
				}
			}
		});
		$(document).on('click', function(evt) {
			if(isCreatingPoly || isCreatingLines) {
				newPolyPoints.push(Math.floor((evt.offsetX + camera.x) / 10) * 10);
				newPolyPoints.push(Math.floor((evt.offsetY + camera.y) / 10) * 10);
			}
		});
		$(document).on('mousemove', function(evt) {
			mouse = {
				x: Math.floor((evt.offsetX + camera.x) / 10) * 10,
				y: Math.floor((evt.offsetY + camera.y) / 10) * 10
			};
		});

		//important stuff that happens every frame
		function tick(ms) {
			//move the player
			player.vel.x = 0;
			if(keys[KEY.A]) { player.vel.x = -265; }
			if(keys[KEY.D]) { player.vel.x = 265; }
			player.vel.y = 0;
			if(keys[KEY.W]) { player.vel.y = -265; }
			if(keys[KEY.S]) { player.vel.y = 265; }
			player.tick(ms);

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
			ctx.fillStyle = '#fffff2';
			ctx.fillRect(0, 0, WIDTH, HEIGHT);
			level.render(ctx, camera);
			player.render(ctx, camera);
			if(newPolyPoints.length > 0) {
				ctx.strokeStyle = '#666';
				ctx.lineWidth = 0.5;
				ctx.beginPath();
				if(isCreatingLines) {
					ctx.moveTo(mouse.x - camera.x, mouse.y - camera.y);
				}
				else {
					ctx.moveTo(newPolyPoints[0] - camera.x, newPolyPoints[1] - camera.y);
					ctx.lineTo(mouse.x - camera.x, mouse.y - camera.y);
				}
				for(var i = newPolyPoints.length - 2; i >= 0; i -= 2) {
					ctx.lineTo(newPolyPoints[i] - camera.x, newPolyPoints[i+1] - camera.y);
				}
				ctx.stroke();
			}
		}

		function everyFrame(ms) {
			tick(ms);
			camera.x = player.pos.x - WIDTH / 2;
			camera.y = player.pos.y - HEIGHT / 2;
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