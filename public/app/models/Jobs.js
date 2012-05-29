define([
	'underscore',
	'backbone',
	'models/Job'
	], function(_, Backbone, Job){

		var Jobs = Backbone.Collection.extend({

			model: Job,

			setClient: function(client){
				var url = '/api/clients/:cid/jobs';
				this.url = url.replace(':cid', client.id);
			}
			// TODO: agregar filtrado por tipo
		});
		
		return Jobs;
});