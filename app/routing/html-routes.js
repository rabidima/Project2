// ===============================================================================
// DEPENDENCIES
// We need to include the path package to get the correct file path for our html
// ===============================================================================
var path = require('path');


// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
	// HTML GET Requests
	// Below code handles when users "visit" a page.
	// ---------------------------------------------------------------------------

	app.get('/details', function (req, res) {
		res.sendFile(path.join(__dirname + '/../public/details.html'));
	});

	app.get('/home', function (req, res) {
			res.sendFile(path.join(__dirname + '/../public/home.html'));
		});
	app.get('/results', function (req, res) {
			res.sendFile(path.join(__dirname + '/../public/results.html'));
		});
	
	// If no matching route is found default to home
	app.use(function (req, res) {
		res.sendFile(path.join(__dirname + '/../public/index.html'));
	});
};
