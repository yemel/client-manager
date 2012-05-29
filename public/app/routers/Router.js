define([
  'jquery',
  'underscore', 
  'backbone',
  'views/ClientView',
  'views/ClientEditView',
  'views/ClientListView'
  ], function($, _, Backbone, ClientView, ClientEdit, ClientListView){
	var MainRouter = Backbone.Router.extend({
		
		routes: {
			"clients/add" : "addClient",
			"clients/:id" : "showClient",
			"clients/:id/edit" : "editClient",
			"" : "showList",
			"*other" : "defaultRoute"
		},

		initialize: function(){
			this.main = $('#main');
		},

		showClient: function(id){
			new ClientView({model: clients.get(id)}).render();
		},

		addClient: function(){
			new ClientEdit().render();
		},

		editClient: function(id){
			new ClientEdit({model: clients.get(id)}).render();
		},

		showList: function(){
			listView = new ClientListView({model: clients});
			this.main.html(listView.el);
		},

		defaultRoute: this.showList
	});

	return MainRouter;
});
