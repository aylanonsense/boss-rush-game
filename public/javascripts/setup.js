requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		lib: '/javascripts/lib',
		game: '/javascripts/game',
		jquery: '/javascripts/lib/jquery'
	}
});
requirejs([
	'game/Main',
	'game/level/LevelEditorMain'
], function(
	Main,
	LevelEditorMain
) {
	if(false) {
		Main();
	}
	else {
		LevelEditorMain();
	}
});