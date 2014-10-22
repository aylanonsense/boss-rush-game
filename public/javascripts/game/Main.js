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
			requestAnimationFrame(loop);
		}
		requestAnimationFrame(loop);

		//add input bindings
		var keys = { pressed: {} };
		var MOVE_KEYS = {
			UP: 87, //W
			LEFT: 65, //A
			DOWN: 83, //S
			RIGHT: 68 //D
		};
		var JUMP_KEY = 32; //SPACE
		var moveX = 0;
		var moveY = 0;
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
				if(evt.which === MOVE_KEYS.UP) { moveY = -1; }
				else if(evt.which === MOVE_KEYS.DOWN) { moveY = 1; }
				else if(evt.which === MOVE_KEYS.LEFT) { moveX = -1; }
				else if(evt.which === MOVE_KEYS.RIGHT) { moveX = 1; }
				level.player.setMoveDir(moveX, moveY);
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
				if(evt.which === MOVE_KEYS.UP) { moveY = (keys[MOVE_KEYS.DOWN] ? 1 : 0); }
				else if(evt.which === MOVE_KEYS.DOWN) { moveY = (keys[MOVE_KEYS.UP] ? -1 : 0); }
				else if(evt.which === MOVE_KEYS.LEFT) { moveX = (keys[MOVE_KEYS.RIGHT] ? 1 : 0); }
				else if(evt.which === MOVE_KEYS.RIGHT) { moveX = (keys[MOVE_KEYS.LEFT] ? -1 : 0); }
				level.player.setMoveDir(moveX, moveY);
			}
		});
	};
});