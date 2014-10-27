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
		if(level.player) {
			level.player.startOfFrame();
		}
		for(i = 0; i < level.actors.length; i++) {
			level.actors[i].startOfFrame();
		}

		//move everything
		for(i = 0; i < level.actors.length; i++) {
			if(level.actors[i].isAlive()) {
				level.actors[i].planMovement();
				level.actors[i].checkForCollisions(level.tileGrid, level.obstacles, level.actors);
				for(steps = 0; steps < 20 && level.actors[i].hasMovementRemaining(); steps++) {
					level.actors[i].move();
					if(level.actors[i].isCollidable) {
						level.actors[i].checkForCollisions(level.tileGrid, level.obstacles, level.actors);
					}
				}
				if(steps === 20) { console.warn("Maximum move steps per frame exceeded."); }
			}
		}
		if(level.player) {
			level.player.planMovement();
			level.player.checkForCollisions(level.tileGrid, level.obstacles, level.actors);
			for(steps = 0; steps < 20 && level.player.hasMovementRemaining(); steps++) {
				level.player.move();
				if(level.player.isCollidable) {
					level.player.checkForCollisions(level.tileGrid, level.obstacles, level.actors);
				}
			}
		}
		if(steps === 20) { console.warn("Maximum move steps per frame exceeded."); }

		//end of movement
		if(level.player) {
			level.player.finishMovement();
		}
		for(i = 0; i < level.actors.length; i++) {
			if(level.actors[i].isAlive()) {
				level.actors[i].finishMovement();
			}
		}

		//update widgets
		for(i = 0; i < level.effects.length; i++) {
			if(level.effects[i].isAlive()) {
				level.effects[i].update();
			}
		}

		//check for hits
		for(i = 0; i < level.actors.length; i++) {
			if(level.actors[i].isAlive()) {
				for(j = 0; j < level.actors.length; j++) {
					if(i !== j && level.actors[j].isAlive()) {
						level.actors[i].checkForHitting(level.actors[j]);
					}
				}
			}
		}
		if(level.player) {
			for(i = 0; i < level.actors.length; i++) {
				if(level.actors[i].isAlive()) {
					level.player.checkForHitting(level.actors[i]);
					level.actors[i].checkForHitting(level.player);
				}
			}
		}

		//end of frame
		level.endOfFrame();
		if(level.player) {
			level.player.endOfFrame();
		}
		for(i = 0; i < level.actors.length; i++) {
			if(level.actors[i].isAlive()) {
				level.actors[i].endOfFrame();
			}
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
		//render actors
		for(i = 0; i < level.actors.length; i++) {
			if(level.actors[i].isAlive()) {
				level.actors[i].render(ctx, camera);
			}
		}
		if(level.player) {
			level.player.render(ctx, camera);
		}
		//render special effects
		for(i = 0; i < level.effects.length; i++) {
			if(level.effects[i].isAlive()) {
				level.effects[i].render(ctx, camera);
			}
		}

		//render hud
		level.renderHUD(ctx);
	}

	return {
		update: update,
		render: render
	};
});