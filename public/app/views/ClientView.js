define([
  'jquery',
  'underscore', 
  'backbone',
  'models/Job',
  'text!templates/client-view-tmpl.html',
  'text!templates/job-item-tmpl.html'
  ], function($, _, Backbone, Job, clientViewTemplate, jobItemTemplate){
	var ClientView = Backbone.View.extend({

		el: $('#main'),

		template: _.template(clientViewTemplate),

		jobTemplate: _.template(jobItemTemplate),

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

	return ClientView;
});