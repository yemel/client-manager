define([
  'jquery',
  'underscore', 
  'backbone',
  'views/ClientItemView',
  'text!templates/client-list-tmpl.html'
  ], function($, _, Backbone, ClientItemView, clientListTemplate){

	var ClientListView = Backbone.View.extend({

		initialize: function(){
			this.render();
			this.addAll();
			this.model.bind("reset", this.addAll, this);
		},

		render: function(){
			console.log(this);
			this.$el.html(clientListTemplate);
			this.list = this.$('#client-list');
			footer.renderList(this.model);
		},

		addAll: function(){
			this.list.html('');
			this.model.each(this.addOne, this);
		},

		addOne: function(newClient){
			var view = new ClientItemView({model: newClient});
			this.list.append(view.render().el);
		},
	});

	return ClientListView;
});