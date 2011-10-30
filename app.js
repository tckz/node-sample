
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
;

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'mysecret desu' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', routes.index);

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var io = require("socket.io").listen(app);
//io.set("log level", 1);

var num_of_participants = 0;
io.sockets.on('connection', function(client) {
	num_of_participants++;
	var create_msg = function(msg) {
		var msg = {
			count: num_of_participants,
			text: msg,
		};
		return msg;
	}

	var msg = create_msg("New client was entered: " + client.id);
	client.broadcast.json.emit("msg push", msg);
	client.json.emit("msg push", create_msg("Welcome: your id=" + client.id));

	client.on("msg client", function(message) {
		var msg = create_msg(message);
		client.broadcast.json.emit("msg push", msg);
		client.json.emit("msg push", msg);
	});

	client.on('disconnect', function() {
		num_of_participants--;
		client.broadcast.json.emit("msg push", create_msg("Client left: " + client.id));
	});


});


