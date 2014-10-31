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
		var camera = { x: 48, y: 48 };
		var level = new Level();

		//set up animation frame functionality
		function loop() {
			GameplayLoop.update(level);
			GameplayLoop.render(ctx, camera, level);
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
				if(level.player.isInputEnabled()) { level.player.setMoveDir(moveX); }
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				if(evt.which === MOVE_LEFT_KEY) { moveX = (keys[MOVE_RIGHT_KEY] ? 1 : 0); }
				else if(evt.which === MOVE_RIGHT_KEY) { moveX = (keys[MOVE_LEFT_KEY] ? -1 : 0); }
				else if(evt.which === JUMP_KEY && level.player.isInputEnabled()) { level.player.stopJumping(); }
				if(level.player.isInputEnabled()) { level.player.setMoveDir(moveX); }
			}
		});
	};
});