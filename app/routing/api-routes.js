// ===============================================================================
// LOAD DATA
// ===============================================================================

// ===============================================================================
// ROUTING
// ===============================================================================

var trailsData = require('../data/trails.js');
var request = require('request');
var TransitAndTrails = require("transitandtrails");

var tnt = new TransitAndTrails({
		  key: "2e5b17ab10f75e98ad4802a9301e8e7c253d3a4c50736c63e1d91170c7106550"
		});

module.exports = function (app) {
	

	// API NPM GET Requests
	
	// app.get('/api/trailsnpm', function(req,res){
		
	// 	 console.log("Request made" + req.params);
	// 	 // console.log("RESponse----" + res.params);

		
		
	// 	tnt.getTrailhead(999, function(err, trailhead) {
	// 			if (err) {
	// 			throw err;
	// 			}
				
	// 			// console.log(trailhead)
					
	// 	res.jsonp(trailhead);
	
	// 	});
	// });	


	// API GET Requests

	app.get('/api/trailsapi/:long/:lat/', function(req,res){
	// app.get('/api/trailsapi/', function(req,res){	
		var trailsURL = 'https://api.transitandtrails.org/api/v1/trailheads';
		var key = '?key=2e5b17ab10f75e98ad4802a9301e8e7c253d3a4c50736c63e1d91170c7106550';
		var limit = '&limit=10';

		var lat = req.params.lat;
		var long = req.params.long;

		var longitude = "&longitude=" + long;
		var latitude = "&latitude=" + lat;
		var distance = "&distance=15";

		//make request to trails api with lat long distance
		request(trailsURL + key + longitude + latitude + limit + distance, function (error, response, body) {
		  if (!error && response.statusCode == 200) {
		    console.log("API route" + body) 

// 		//once request is complete ".then()" send it to the front end
		    res.json(body)
		  }
		})
	});	
// 		
		
};	
	

	
	// API POST Requests
	// Below code handles when a user submits a form and thus submits data to the server.
	// In each of the below cases, when a user submits form data (a JSON object)
	// ...the JSON is pushed to the appropriate Javascript array
	

	// // ---------------------------------------------------------------------------
	// // Clear out the table while working with the functionality.

	// app.post('/api/clear', function () {
	// 	// Empty out the arrays of data
	// 	friendsData = [];
	
		
	// });

