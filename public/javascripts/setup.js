requirejs.config({
	baseUrl: 'javascripts',
	paths: {
		lib: '/javascripts/lib',
		app: '/javascripts/app',
		jquery: '/javascripts/lib/jquery'
	}
});
requirejs([ 'app/Main', 'app/MapBuilder' ], function(Main, MapBuilder) {
	//TODO this isn't the right way to choose main methods
	if(document.URL.indexOf('map-builder') >= 0) {
		MapBuilder();
	}
	else {
		Main();
	}
});