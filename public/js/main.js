$(function(){

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

var Clients = Backbone.Collection.extend({
	
	model: Client,

	url: '/api/clients',

	pinned: function(){
		return this.where({pinned: true});
	}
});

var Jobs = Backbone.Collection.extend({

	model: Job,

	setClient: function(client){
		var url = '/api/clients/:cid/jobs';
		this.url = url.replace(':cid', client.id);
	}
	// TODO: agregar filtrado por tipo
});


var ClientItemView = Backbone.View.extend({
	
	tagName: 'li',

	template: _.template($('#client-item-tmpl').html()),

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

var ClientsListView = Backbone.View.extend({

	// events: {
	// 	"click" : "addClient"
	// },

	initialize: function(){
		this.render();
		this.addAll();
		this.model.bind("reset", this.addAll, this);
	},

	render: function(){
		this.$el.html($('#client-list-tmpl').html());
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

var FooterView = Backbone.View.extend({
	
	el: $('footer'),

	listTemplate: _.template($('#client-list-footer-tmpl').html()),

	clientTemplate: _.template($('#client-footer-tmpl').html()),

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

var ClientView = Backbone.View.extend({

	el: $('#main'),

	template: _.template($('#client-view-tmpl').html()),

	jobTemplate: _.template($('#job-item-tmpl').html()),

	events: {
		"click #add-job-link": "toggleForm",
		"click #cancel": "toggleForm",
		"click #save": "saveJob",
		"change #type": "loadJobNames"
	},

	initialize: function(){
		jobs.setClient(this.model);
		jobs.bind('add', this.addJob, this);
		jobs.bind('reset', this.addJobs, this);
		jobs.fetch();
	},

	render: function(){
		this.$el.html(this.template(this.model.toJSON()));
		footer.renderClient(this.model);

		this.loadJobCategories();
		this.loadJobNames();
	},

	addJob: function(job){
		var data = job.toJSON();
		data.date = job.getDate();
		data.status = job.getStatus();
		var view = this.jobTemplate(data);
		this.$('#jobs-list').append(view);
	},

	addJobs: function(){
		jobs.each(this.addJob, this);
	},

	saveJob: function(){
		var self = this;
		var job = new Job({
			client_id: self.model.id,
			type: JobsCategory[self.$('#type').val()].type,
			name: JobsCategory[self.$('#type').val()].values[self.$('#name').val()],
			total_price: self.$('#total_price').val()
		});
		job.setOffer(new Date(), 20);
		jobs.create(job);
		console.log(job);
	},

	toggleForm: function(){
		this.$('#add-job').toggle();
		this.$('#add-job-link').toggle();
		return false;
	},

	loadJobCategories: function(){
		var cats = this.$('#type');
		_.each(JobsCategory, function(c, index){
			cats.append('<option value="'+index+'">'+c.type+'</option>');
		});
	},

	loadJobNames: function(){
		var cat = this.$('#type').val();
		var names = this.$('#name');
		names.html('');
		_.each(JobsCategory[cat].values, function(n, index){
			names.append('<option value="'+index+'">'+n+'</option>');
		});
	}
});

var ClientEdit = Backbone.View.extend({

	el: $('#main'),

	template: _.template($('#client-edit-tmpl').html()),

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
		listView = new ClientsListView({model: clients});
		this.main.html(listView.el);
	},

	defaultRoute: this.showList
});

footer = new FooterView();
Router = new MainRouter();
JobsCategory = [
	{ type: 'Documentación Provincial',
		values: [
			'Categorización',
			'Recategorizacion',
			'Factibilidad',
			'Estudio de impacto ambiental',
			'Auditoria ambiental de renovación de impacto ambiental',
			'Declaracion Jurada de Residuos especiales (anuales)'
		]},
	{ type: 'Documentacion de Compresores y Calderas',
		values: [
			'Habilitacion de aparatos sometidos a presion sin fuego',
			'Habilitacion de aparatos sometidos a presion con fuego',
			'Extensión de vida util de aparatos sometidos a presion con fuego/ sin fuego',
			'Medicion de espesores de aparatos sometidos a presion con fuego/ sin fuego (anual)'
		]},
	{ type: 'Documentacion de Efluentes Gaseosos',
		values: [
			'Medicion y solicitud de Permiso de emision a la atmosfera',
			'Monitoreo de emisiones gaseososas ( anual)'
		]},
	{ type: 'Documentacion Municipal',
		values: [
			'Habilitacion de industria',
			'Actualizacion de habilitacion de industria',
			'Habilitacion comercial',
			'Baja de habilitacion comercial',
			'Plano de obra'
		]},
	{ type: 'Documentacion Efluentes Liquidos',
		values: [
			'Declaracion Jurada de E. liquidos (anual)',
			'Plano Sanitario',
			'Muestreo de vertidos'
		]},
	{ type: 'Documentacion Nacional',
		values: [
			'Servicio de higiene y seguridad en el trabajo (mensual)',
			'Estudio de carga de fuego',
			'Mediciones de puesta a tierra',
			'Mediciones ambientales internas',
			'Medicion de ruidos externos',
			'Solicitud de clave unico de empradronameinto territorial (CURT)',
			'Seguro ambiental',
			'Solicitud de eximicion del seguro ambiental',
			'Capacitaciones en seguridad e higiene'
		]},
];

State = (function(){

	

})();

// Bootstraping the collection
clients = new Clients();
jobs = new Jobs();
clients.fetch({success: function(collection, resp){
	Backbone.history.start();
	// Router.navigate();
}});

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