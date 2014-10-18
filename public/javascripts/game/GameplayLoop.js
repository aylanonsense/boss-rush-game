if (typeof define !== 'function') { var define = require('amdefine')(module); }
define([
	'game/Global'
], function(
	Global
) {
	function update(level) {
		var i, j, steps;

		//start of frame
		level.startOfFrame();
		level.player.startOfFrame();
		for(i = 0; i < level.actors.length; i++) {
			level.actors[i].startOfFrame();
		}

		//move everything
		level.player.planMovement();
		for(steps = 0; steps < 20 && level.player.hasMovementRemaining(); steps++) {
			level.player.move();
			if(level.player.isCollidable) {
				level.player.checkForCollisions(level.tileGrid, level.obstacles);
			}
		}
		if(steps === 20) { throw new Error("Maximum move steps per frame exceeded."); }
		for(i = 0; i < level.actors.length; i++) {
			//move each actor
			level.actors[i].planMovement();
			for(steps = 0; steps < 20 && level.actors[i].hasMovementRemaining(); steps++) {
				level.actors[i].move();
				if(level.actors[i].isCollidable) {
					level.actors[i].checkForCollisions(level.tileGrid, level.obstacles);
				}
			}
			if(steps === 20) { throw new Error("Maximum move steps per frame exceeded."); }
		}

		//end of movement
		level.player.finishMovement();
		for(i = 0; i < level.actors.length; i++) {
			level.actors[i].finishMovement();
		}

		//update widgets
		for(i = 0; i < level.effects.length; i++) {
			level.effects[i].update();
		}

		//check for hits
		for(i = 0; i < level.actors.length; i++) {
			for(j = 0; j < level.actors.length; j++) {
				if(i !== j) {
					level.actors[i].checkForHitting(actors[j]);
				}
			}
		}
		for(i = 0; i < level.actors.length; i++) {
			level.player.checkForHitting(level.actors[i]);
			level.actors[i].checkForHitting(level.player);
		}

		//end of frame
		level.endOfFrame();
		level.player.endOfFrame();
		for(i = 0; i < level.actors.length; i++) {
			level.actors[i].endOfFrame();
		}
	}

	function render(ctx, camera, level) {
		var i;
		//adjust camera
		//TODO
		//render background
		ctx.fillStyle = (Global.DEBUG_MODE ? '#000' : level.backgroundColor);
		ctx.fillRect(0, 0, Global.WIDTH, Global.HEIGHT);
		//render tiles and obstacles
		level.backgroundTileGrid.render(ctx, camera);
		level.tileGrid.render(ctx, camera);
		for(i = 0; i < level.obstacles.length; i++) {
			level.obstacles[i].render(ctx, camera);
		}
		//render widgets
		for(i = 0; i < level.widgets.length; i++) {
			level.widgets[i].render(ctx, camera);
		}
		//render special effects
		for(i = 0; i < level.effects.length; i++) {
			level.effects[i].render(ctx, camera);
		}
		//render actors
		for(i = 0; i < level.actors.length; i++) {
			level.actors[i].render(ctx, camera);
		}
		level.player.render(ctx, camera);
	}

	return {
		update: update,
		render: render
	};
});