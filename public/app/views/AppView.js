define([
	'jquery',
	'underscore',
	'backbone',
	'views/FooterView',
	'routers/Router',
	'models/JobsCategory',
	'models/Clients',
	'models/Jobs',
	], function($,_,Backbone, FooterView, MainRouter, JobsCat, Clients, Jobs){
		
		console.log('Define Global namespace');
		footer = new FooterView();
		Router = new MainRouter();
		JobsCategory = JobsCat;

		// Bootstraping the collection
		clients = new Clients();
		jobs = new Jobs();
		clients.fetch({success: function(collection, resp){
			Backbone.history.start();
			// Router.navigate();
		}});

		return function(){
			this.hola = 'Hola';
			this.chau = 'chau!';
		};
});

/* app.js
 Basic architecture:
 - Models are responsible for getting book data from API
 - Singleton state model is responsible for ui state data
 - Views are responsible for:
    initialize:
    - instantiating/fetching their models if necessary
    - instantiating sub-views
    - listening for state changes
    - listening for model changes
    render:
    - adjusting the layout of their container boxes
    - creating their content
    events:
    - listening for ui events, updating state
    ui methods:
    - updating ui on state change
    - updating ui on model change
 - Routers are responsible for:
    - setting state depending on route
    - setting route depending on state
    
 Process of opening a view:
 - URL router or UI event sets state.topview to the requested view class
 - State fires topview:change
 - AppView receives event, closes other views, calls view.open()
 - view clears previous content if necessary
 - view either renders, or fetches data and renders in the callback
*/