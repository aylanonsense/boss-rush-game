requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		lib: '/javascripts/lib',
		game: '/javascripts/game',
		jquery: '/javascripts/lib/jquery'
	}
});
requirejs([ 'game/Main' ], function(Main, MapBuilder) {
	Main();
});