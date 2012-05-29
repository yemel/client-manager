define([
	'underscore',
	'backbone',
	'models/Client'
	], function(_, Backbone, Client){

		var Clients = Backbone.Collection.extend({
	
			model: Client,

			url: '/api/clients',

			pinned: function(){
				return this.where({pinned: true});
			}
		});

		return Clients;
});