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
	//get querystring params
	var querystring = {};
	if(window.location.href.indexOf('?') > -1) {
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			querystring[hashes[i].split('=')[0]] = hashes[i].split('=')[1];
		}
	}

	if(+querystring.edit) {
		LevelEditorMain();
	}
	else {
		Main();
	}
});