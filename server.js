// ==============================================================================
// DEPENDENCIES
// ==============================================================================

var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var fallback = require('express-history-api-fallback');

// ==============================================================================
// EXPRESS CONFIGURATION
// ==============================================================================

var app = express(); // create an "express" server
var PORT = process.env.PORT || 3000; // Sets an initial port.

// BodyParser makes it easy for our server to interpret data sent to it.
app.use(bodyParser.json());	
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.text());
app.use(bodyParser.json({type:'application/vnd.api+json'}));
app.use(express.static(path.join(__dirname + '/app/public')));

// express-history-api-fallback
// app.use(fallback(path.join(__dirname + '/app/public/index.html')));


// ================================================================================
// ROUTER
// ================================================================================

require('./app/routing/api-routes.js')(app); 
require('./app/routing/html-routes.js')(app);


// ==============================================================================
// LISTENER
// ==============================================================================

app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});