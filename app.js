
/**
 * Module dependencies.
 */

var app_root = __dirname,
  express = require('express'),
  path = require('path'),
  mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Database

mongoose.connect('mongodb://localhost/albert_database');

// Configuration

app.configure(function(){
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.logger({ format: ':method :url' }));
  app.use(app.router);
  app.use(express.static(path.join(app_root, 'public')));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Schema

var Schema = mongoose.Schema;

var State = new Schema({
  date: {type: Date, default: Date.now },
  status: {type: String, required: true}, // TODO: Validar las opciones
  price: {type: Number, default: 0}
});

var StateModel = mongoose.model('State', State);

var Job = new Schema({
  client_id: {type: String, required: true},
  type: {type: String, required: true},
  name: {type: String, required: true},
  total_price: {type: Number},
  state: [State]
});

var JobModel = mongoose.model('Job', Job);

var Client = new Schema({
  name: { type: String, required: true },
  address: { type: String },
  category: [String],
  cuit: {type: String },
  pinned: {type: Boolean, default: false },
  created: { type: Date, default: Date.now }
});

var ClientModel = mongoose.model('Client', Client);

// Routes

app.get('/api', function(req, res){
  res.send('AlbertService API is running');
});

app.get('/api/clients', function(req, res){
  return ClientModel.find(function (err, clients){
    if(!err){
      return res.send(clients);
    } else {
      return console.log(err);
    }
  });
});

app.get('/api/clients/:id/jobs', function(req, res){
  return JobModel.find({client_id: req.params.id}, function(err, jobs){
    if(!err){
      return res.send(jobs);
    } else {
      return console.log(err);
    }
  });
});


app.post('/api/clients', function(req, res){
  var client;
  console.log('POST: ');
  console.log(req.body);
  client = new ClientModel({
    name: req.body.name,
    address: req.body.address,
    category: req.body.category,
    cuit: req.body.cuit
  });
  client.save(function(err){
    if(!err){
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(client);
});

app.post('/api/clients/:id/jobs', function(req, res){
  // TODO: asegurarse que existe el cliente id
  var job = new JobModel({
    client_id: req.params.id,
    type: req.body.type,
    name: req.body.name,
    total_price: req.body.total_price,
    state: req.body.state
  });
  job.save(function(err){
    if(!err){
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(job);
});


app.put('/api/clients/:id', function(req, res){
  return ClientModel.findById(req.params.id, function(err, client){
    client.name = req.body.name;
    client.address = req.body.address;
    client.category = req.body.category;
    client.cuit = req.body.cuit;
    return client.save(function(err){
      if(!err){
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(client);
    });
  });
});

app.put('/api/clients/:id/jobs/:jid', function(req, res){
  JobModel.findOne({_id: req.params.jid, client_id: req.params.id}, function(err, job){
    job.type = req.body.type;
    job.name = req.body.name;
    job.total_price = req.body.price;
    job.state = req.body.state;
    return jobs.save(function(err){
      if(!err){
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(job);
    });
  });
});

app.delete('/api/clients/:id', function(req, res){
  return ClientModel.findById(req.params.id, function(err, client){
    return client.remove(function(err){
      if(!err){
        console.log("removed");
        res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.delete('/api/clients/:id/jobs/:jid', function(req, res){
  return JobModel.findOne({_id: req.params.jid, client_id: req.params.id}, function(err, job){
    return job.remove(function(err){
      if(!err){
        console.log("removed");
        res.send('');
      } else {
        console.log(err);
      }
    });
  });
});

app.listen(3001, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});