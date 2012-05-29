define([
  'jquery',
  'underscore', 
  'backbone',
  'text!templates/client-item-tmpl.html'
  ], function($, _, Backbone, clientItemTemplate){

  	var ClientItemView = Backbone.View.extend({
	
		tagName: 'li',

		template: _.template(clientItemTemplate),

		events: {
			"click": "toClientView"
		},

		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},

		toClientView: function(){
			Router.navigate('/clients/' + this.model.id, true);	
		}
	});

	return ClientItemView;
});