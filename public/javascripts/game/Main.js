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
		var camera = { x: 0, y: 0 };
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
		$(document).on('keydown', function(evt) {
			if(!keys[evt.which]) {
				keys[evt.which] = true;
			}
		});
		$(document).on('keyup', function(evt) {
			if(keys[evt.which]) {
				keys[evt.which] = false;
			}
		});
	};
});