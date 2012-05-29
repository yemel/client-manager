define(['underscore', 'backbone'], function(_, Backbone){
	var Job = Backbone.Model.extend({

		idAttribute: "_id",

		defaults: {
			client_id: '',
			type: '',
			name: '',
			total_price: 0,
			state: []
		},

		setState: function(status, date, price){
			var state = {
				date: date,
				status: status,
				price: price};
			this.get('state').push(state);
			// this.save();
		},

		setOffer: function(date, price){
			this.setState('OFFER', date, price);
		},

		setWorking: function(date, price){
			this.setState('WORKING', date, price);
		},

		setFinished: function(date, price){
			this.setState('FINISHED', date, price);
		},

		setMensual: function(date, price){
			this.setState('MENUSAL', date, price);
		},

		getDate: function(){
			var state = this.get('state');
			return state.length > 0 ? state[0].date : new Date();
		},

		getStatus: function(){
			var state = this.get('state');
			return state.length > 0 ? state[0].status : 'NOP!';
		}
	});
	return Job;
});