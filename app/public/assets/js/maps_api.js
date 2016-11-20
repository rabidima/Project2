$(document).ready(function() {

// var zipcode = $('#search').val().trim();

// var queryURL = 'https://maps.googleapis.com/maps/api/geocode/json?address=$' + zipcode + '&sensor=false';

// var mapboxAPI = 'https://api.mapbox.com/directions/v5/mapbox.places/Chester.json?country=us&access_token=pk.eyJ1IjoiZGFtaWVud3JpZ2h0IiwiYSI6ImNpdTdvYjlhazAwMGUzM28wdGd5MnYwbDcifQ.Q0yTEMl-dyTpCvVoi87jNA';

	$('#apiBtn').on('click', function() {
		var zipcode = $('#zipInput').val().trim();
		var queryURL = `https://maps.googleapis.com/maps/api/geocode/json?address=${zipcode}&sensor=false`
		console.log('Location entered:', zipcode);

		$.ajax({
			url: queryURL, 
			method:'GET'
		}).done(function(response) {

			if(zipcode.length < 5) {
				console.log('Invalid Zip Code')
			} else {
				for(i=0; i<response.results.length; i++) {
		      		var lat = response.results["0"].geometry.location.lat;
      				var long = response.results["0"].geometry.location.lng;		
					console.log('Latitude:', lat, 'Longitude:', long);
					getTrails(long, lat);
				}
			}	
		
		});
			return false;
	});


  // $.ajax({
  //   url: `${currentURL}/api/trailsapi/${long}/${lat}`,
  //   method: 'GET',
  // }).done(function(response) {

  // });

  function getTrails(long, lat) {
    // var currentURL = window.location.origin;
    // $.get(`${currentURL}/api/trailsapi/${long}/${lat}`,function(req,res){
        console.log('getTrail');

          var trailsURL = 'https://api.transitandtrails.org/api/v1/trailheads';
          var key = '?key=2e5b17ab10f75e98ad4802a9301e8e7c253d3a4c50736c63e1d91170c7106550';
          var request = require('request');

          var limit = '&limit=5';

           // var lat = req.params.lat;
           // var long = req.params.long;
          
           var longitude = "&longitude=" + long;
           var latitude = "&latitude=" + lat;
           var distance = "&distance=15";

           //make request to trails api with lat long distance
           request(trailsURL + key + longitude + latitude + limit + distance, function (error, response, body) {
              if (!error && response.statusCode == 200) {
               console.log(body) 

        //     //once request is complete ".then()" send it to the front end
               res.json(body)
              }   
          });    
  }

	// Display and Update Google Map based on search location
	function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.0522342, lng: -118.2436849},
          zoom: 10,
          mapTypeId: 'terrain'
        });
            
         if(navigator.geolocation) {
         	navigator.geolocation.getCurrentPosition(function(position) {
         		var pos = {
         			lat: position.coords.latitude,
         			lng: position.coords.longitude
         		}
         	});
         }     

        // Create the search box and link it to the UI element.
        var input = document.getElementById('zipInput');
        var searchBox = new google.maps.places.SearchBox(input);
        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
      }
	initAutocomplete();
 });