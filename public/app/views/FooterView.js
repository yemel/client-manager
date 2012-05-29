define([
  'jquery',
  'underscore', 
  'backbone',
  'text!templates/client-list-footer-tmpl.html',
  'text!templates/client-footer-tmpl.html'
  ], function($, _, Backbone, clientListFooterTemplate, clientFooterTemplate){
	var FooterView = Backbone.View.extend({
		
		el: $('footer'),

		listTemplate: _.template(clientListFooterTemplate),

		clientTemplate: _.template(clientFooterTemplate),

		events: {
			"click #add-client" : "addClient",
			"click #edit-client" : "editClient",
			"click #delete-client" : "deleteClient"
		},

		renderList: function(clients){
			this.model = clients;
			this.$el.html(this.listTemplate( {size: clients.size()} ));
		},

		renderClient: function(client){
			this.model = client;
			this.$el.html(this.clientTemplate());
		},

		addClient: function(){
			Router.navigate('/clients/add', true);
		},

		editClient: function(){
			Router.navigate('/clients/' + this.model.id + '/edit', true);
		},

		deleteClient: function(){
			if (!confirm('Estás seguro que querés borrar al cliente?')) return;
			clients.get(this.model.id).destroy({
				success: function(){
					Router.navigate('', true);
				}});
		},
	});

	return FooterView;
});