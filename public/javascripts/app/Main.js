if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'app/Player',
	'app/Level',
	'app/TileWorld',
	'app/tile/SquareTile'
], function(
	$,
	Player,
	Level,
	TileWorld,
	SquareTile
) {
	return function() {
		//canvas
		var WIDTH = 800, HEIGHT = 600, isPaused = false;
		var canvas = $('<canvas width="' + WIDTH + 'px" height = "' + HEIGHT + 'px" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//create stuff
		var level = new Level();
		level.importLevel(document.cookie ? JSON.parse(document.cookie) : [[-110,20,110,20],[110,20,210,10,280,-10,310,-30,330,-60,340,-100,340,-140,330,-170,300,-210,250,-230,190,-240,130,-240,130,-270],[-110,-180,-110,20],[-40,-210,30,-210,-40,-40,-40,-210],[200,-150,230,-130,230,-110,200,-90,170,-110,170,-130,200,-150],[-250,-180,-110,-180],[130,-270,350,-270],[-40,-430,30,-430,30,-410,-40,-410,-40,-430],[90,-570,160,-570,160,-550,90,-550,90,-570],[-250,-450,-250,-410,-230,-410,-230,-360,-250,-360,-250,-320,-230,-320,-230,-270,-250,-270,-250,-180],[-380,-450,-250,-450],[-210,-610,-140,-610,-140,-590,-210,-590,-210,-610],[-530,-480,-460,-480,-380,-450],[-530,-720,-530,-480],[-450,-680,-450,-540,-470,-540,-470,-680],[-330,-920,-530,-720],[-470,-680,-270,-880],[-260,-870,-450,-680],[350,-270,350,-330,380,-330,380,-270,430,-270,430,-350,460,-350,460,-270,510,-270,520,-370,530,-270],[530,-270,610,-270,580,-370,630,-310,630,-460,530,-500,630,-510],[300,-580,430,-470,350,-470,230,-580,300,-580],[630,-510,630,-700,530,-650,600,-740],[600,-740,450,-870],[450,-870,430,-880,430,-900,710,-900,700,-80],[700,-80,650,20],[650,20,650,-150,540,-210,480,-210,380,-150,380,120,-310,120],[480,-90,550,-90,550,-20,480,-20,480,-90],[-310,120,-130,-110,-130,-170,-380,-170,-550,-480,-550,-950,-320,-950,-330,-920],[-270,-880,-70,-880,-70,-870,-260,-870],[-60,-880,-40,-880,-40,-870,-60,-870,-60,-880]]);
		var player = new Player(level.startingPoint.x, level.startingPoint.y);
		var camera = { x: player.pos.x, y: player.pos.y };
		var grapples = [];
		var tiles = new TileWorld();
		tiles.add(new SquareTile(tiles, 2, 0));
		tiles.add(new SquareTile(tiles, -1, -1));

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
			player.tick(ms);

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