// TODO: this should be removed in production mode...
if (typeof DEBUG === 'undefined') {
    DEBUG = true;
    // cache busting for development
    require.config({
        urlArgs: "bust=" +  (new Date()).getTime()
    });
}

require.config({
	baseUrl: '../app',
	paths: {
		jquery: '../lib/jquery/jquery-1.7.1',
		jqueryui: '../lib/jquery/jquery-ui.1.8.20.min',
		tagit: '../lib/jquery/tagit',
		underscore: '../lib/underscore/underscore-min',
		backbone: '../lib/backbone/backbone',
		text: '../lib/require/text'
	}
});

require(['views/AppView'], function(AppView){
	var app_view = new AppView();
	// TODO: si la appview no tiene lógica esto lo podríamos mover
});