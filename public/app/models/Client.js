define(['underscore', 'backbone'], function(_, Backbone){
	var Client = Backbone.Model.extend({
	
		idAttribute: "_id",

		urlRoot: '/api/clients',

		defaults: {
			name: '',
			address: '',
			category: [],
			cuit: '',
			pinned: false
		},

		clear: function(){
			this.destroy();
		}
	});
	return Client;
});