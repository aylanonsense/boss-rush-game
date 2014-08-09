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
		var level = new Level();
		level.importLevel(document.cookie ? JSON.parse(document.cookie) : [[210,20,-240,20,-230,40,-140,80,-30,100,0,120,20,170,40,110,50,130,70,70,80,60,200,40],[190,-80,170,-100,50,-100,30,-80],[0,-30,-30,-30],[170,220,130,220,110,240,130,320,150,360,180,250],[-40,220,-90,170,-170,190,-190,300,-140,390,-110,460,-80,300,-60,320,-30,250],[-420,-130,-460,-130,-450,-100,-440,-80,-430,-100],[-440,-230,-460,-220,-460,-200,-440,-190,-420,-200,-420,-220],[-620,-70,-880,-70,-870,-60,-820,-50,-790,-20,-740,-10,-720,-50,-630,-60],[-860,-330,-890,-330,-880,-310],[-930,-270,-1060,-270,-1070,-310,-1120,-320,-1140,-290,-1220,-290,-1210,-250,-1150,-200,-1140,-140,-1130,-170,-1120,-100,-1080,-200,-1040,-210,-1040,-190,-1020,-230,-940,-260],[-670,-540,-730,-540,-710,-520,-710,-490,-690,-530],[-720,-620,-720,-600,-700,-590,-680,-600,-680,-620,-700,-630],[-860,-520,-920,-520,-890,-500],[-1200,-380,-1200,-360,-1180,-350,-1160,-360,-1160,-380,-1180,-390],[-260,-530,-510,-530,-500,-490,-400,-460,-380,-440,-370,-460,-330,-460,-280,-490,-260,-510],[-430,-690,-480,-690,-470,-660,-450,-640,-430,-660],[-240,-240,-300,-240],[20,-380,-50,-380],[-190,-770,-260,-770,-230,-740,-200,-730],[-70,-630,-100,-630,-100,-570,-20,-510,80,-510,150,-520,170,-550,230,-630,160,-630,150,-610,120,-580,70,-560,30,-560,-10,-580,-30,-610],[440,-800,440,-590,480,-550,500,-750,530,-800],[330,-810,270,-810,280,-800,320,-800]]);
		var player = new Player(level.startingPoint.x, level.startingPoint.y);
		var camera = { x: player.pos.x, y: player.pos.y };
		var grapples = [];

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
				if(evt.which === JUMP_KEY) {
					player.jumpWhenPossible();
				}
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				keys.pressed[evt.which] = false;
			}
		});
		$(document).on('click', function(evt) {
			grapples.push(player.shootGrapple(evt.offsetX + camera.x, evt.offsetY + camera.y));
		});

		//important stuff that happens every frame
		function tick(ms) {
			var i, j;
			//move the grapples
			for(i = 0; i < grapples.length; i++) {
				grapples[i].move(ms);
				//if the grapples are unlatched we need to check for collisions
				if(!grapples[i].isLatched) {
					var grappleCollision = null;
					for(j = 0; j < level.obstacles.length; j++) {
						var potentialGrappleCollision = level.obstacles[j].checkForCollisionWithGrapple(grapples[i]);
						if(potentialGrappleCollision && (!grappleCollision ||
							potentialGrappleCollision.squareDistTo < grappleCollision.squareDistTo)) {
							grappleCollision = potentialGrappleCollision;
						}
					}
					if(grappleCollision) {
						grapples[i].latchTo(grappleCollision.x, grappleCollision.y);
					}
				}
				//if the grapples are latched they apply a force to the player
				if(grapples[i].isLatched) {
					grapples[i].applyForceToPlayer();
				}
			}

			//move the player
			player.applyForce(0, 600); //gravity
			if(keys[KEY.A]) { player.applyForce(-400, 0); }
			if(keys[KEY.D]) { player.applyForce(400, 0); }
			if(keys[KEY.W]) { player.applyForce(0, -400); }
			if(keys[KEY.S]) { player.applyForce(0, 400); }
			player.move(ms);

			//find mid-frame collisions
			var interruption = findInterruption();
			var interruptionKeysAlreadyUsed = [];
			for(i = 0; i < 100 && interruption; i++) {
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
			for(var i = 0; i < grapples.length; i++) {
				grapples[i].render(ctx, camera);
			}
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