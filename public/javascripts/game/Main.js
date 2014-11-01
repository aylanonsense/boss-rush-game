if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'jquery',
	'game/Global',
	'game/GameplayLoop',
	'game/levels/ElementalRoyalty/Level'
], function(
	$,
	Global,
	GameplayLoop,
	Level
) {
	return function() {
		//canvas
		var canvas = $('<canvas width="' + Global.WIDTH + 'px" height = "' + Global.HEIGHT + 'px" ' +
			'style="display:block;margin: 15px auto;" />').appendTo(document.body);
		var ctx = canvas[0].getContext('2d');

		//init objects
		var frame = 0;
		var camera = { x: 48, y: 48 };
		var level = new Level();
		var framesUntilNextThing = null;

		//set up animation frame functionality
		function loop() {
			frame++;
			//moving in slow (or normal) motion
			if(level.timeScale >= 1.0 && frame % Math.floor(level.timeScale) === 0) {
				GameplayLoop.update(level);
				GameplayLoop.render(ctx, camera, level);
			}
			//moving in fast motion
			else {
				for(var f = level.timeScale; f < 1.00; f += level.timeScale) {
					GameplayLoop.update(level);
					GameplayLoop.render(ctx, camera, level);
				}
			}
			//swipe screen on level end
			if(level.hasEnded) {
				if(framesUntilNextThing === null) {
					framesUntilNextThing = 20;
				}
				framesUntilNextThing--;
				ctx.fillStyle = '#000';
				ctx.beginPath();
				ctx.moveTo(Global.WIDTH, Global.HEIGHT)
				ctx.lineTo((Global.WIDTH + Global.HEIGHT) * framesUntilNextThing / 20 - Global.HEIGHT, Global.HEIGHT);
				ctx.lineTo(Global.WIDTH, 2 * ((Global.WIDTH + Global.HEIGHT) * framesUntilNextThing / 20 - Global.WIDTH));
				ctx.lineTo(Global.WIDTH, Global.HEIGHT);
				ctx.fill();
			}
			scheduleLoop();
		}
		function scheduleLoop() {
			if(Global.DEBUG_FRAMERATE) {
				setTimeout(loop, 1000 / Global.DEBUG_FRAMERATE);
			}
			else {
				requestAnimationFrame(loop);
			}
		}
		scheduleLoop();

		//add input bindings
		var keys = { pressed: {} };
		var MOVE_LEFT_KEY = 37; //left arrow
		var MOVE_RIGHT_KEY = 39; //right arrow
		var JUMP_KEY = 32; //SPACE
		var SHOOT_KEY = 65; //A
		var moveX = 0;
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				if(evt.which === MOVE_LEFT_KEY) { moveX = -1; }
				else if(evt.which === MOVE_RIGHT_KEY) { moveX = 1; }
				else if(evt.which === JUMP_KEY && level.player.isInputEnabled()) { level.player.jump(); }
				else if(evt.which === SHOOT_KEY && level.player.isInputEnabled()) { level.player.fireProjectile(); }
				level.player.setMoveDir(moveX);
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				if(evt.which === MOVE_LEFT_KEY) { moveX = (keys[MOVE_RIGHT_KEY] ? 1 : 0); }
				else if(evt.which === MOVE_RIGHT_KEY) { moveX = (keys[MOVE_LEFT_KEY] ? -1 : 0); }
				else if(evt.which === JUMP_KEY && level.player.isInputEnabled()) { level.player.stopJumping(); }
				level.player.setMoveDir(moveX);
			}
		});
	};
});