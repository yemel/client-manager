define([
  'jquery',
  'underscore', 
  'backbone',
  'models/Client',
  'text!templates/client-edit-tmpl.html',
  'jqueryui', 'tagit'
  ], function($, _, Backbone, Client, clientEditTemplate){

	var ClientEdit = Backbone.View.extend({

		el: $('#main'),

		template: _.template(clientEditTemplate),

		events: {
			"click #save" : "save",
			"click #cancel" : "cancel"
		},

		render: function(){
			var model = this.model || new Client();
			var data = model.toJSON();
			data.edit = this.model != null;
			this.$el.html(this.template(data));
			this.$('#category').tagit({
				// tagSource: ['Pinturería',
				// 			'Químicos',
				// 			'Textil',
				// 			'Consultora',
				// 			'Municipal'],
				triggerKeys:['enter', 'comma', 'tab']});
		},

		save: function(){
			// Esto se puede abstraer en un form-helper
			var name = this.$('#name').val();
			var address = this.$('#address').val();
			var cuit = this.$('#cuit').val();

			var tags = _.map($('#category').tagit('tags'), function(a){return a.value;});
			var data = {name: name, address: address, cuit: cuit, category: tags};
			this.model ?
				this.model.save(data, {success: this.onSuccess}) :
				clients.create(data, {success: this.onSuccess});
		},

		cancel: function(){
			history.go(-1);
		},

		onSuccess: function(model, res){
			Router.navigate('/clients/' + model.id, true);	
		}
	});

	return ClientEdit;
});