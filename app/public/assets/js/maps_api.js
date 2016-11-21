
$(document).ready(function() {

function getZip() {
	// $('#apiBtn').on('click', function() {
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
          console.log("response" + response.results);
					getTrails(long, lat);
				}
			}	
		
		});
			return false;
	};



  function getTrails(long, lat) {
  
    // Here we get the location of the root page. 
    var currentURL = window.location.origin;
    $('#trailsDiv').empty();
      $.ajax({
          url: `${currentURL}/api/trailsapi/${long}/${lat}`,
          method: 'GET',
        })
      .done(function(trailsList) {
        var trails = JSON.parse(trailsList);

        initMap(trails); 

        // Loop through each of the trails 
        for (var i=0; i<trails.length; i++){
          // Display only trails with park name
          if(trails[i].park_name!=null){

         // Create the HTML Well (Div) and Add the content for each trail
          var trailsDiv = $("<div>");
          trailsDiv.addClass('well well-sm');
          trailsDiv.attr('id', 'tableWell-' + i);
          $('#trailsDiv').append(trailsDiv);

          var trailNum = i + 1;
          
        // Then display the remaining fields in the HTML 
          $("#tableWell-" + i).append("<p><a>" + trails[i].name + "</a></p>");
          } 
         }
          
        });
  }

	// Geolocation: Display and Update Google Map based on search location
	function initAutocomplete() {
        // Default position Los Angeles
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: 34.0522342, lng: -118.2436849},
          zoom: 10
        });
        
        var infoWindow = new google.maps.InfoWindow({map: map});

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
              var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              };

              infoWindow.setPosition(pos);
              infoWindow.setContent('You Are Here');
              map.setCenter(pos);
            }, function() {
                  handleLocationError(true, infoWindow, map.getCenter());
                });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
      };

        // Link Search box to the UI element.
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

            // Create a marker 
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
          getZip();
        });
      }
	initAutocomplete();

// Place markers
  function initMap(trails) {
    // Create a marker 
    var markers = [];
    var map = new google.maps.Map(document.getElementById('map'), {
        
      });
    for (var i=0; i<trails.length; i++){
      var uluru = {lat: trails[i].latitude, lng: trails[i].longitude};
      
      markers.push(new google.maps.Marker({
        position: uluru,
        map: map
      }));
    } 
  }




 }); <!-- Document ready end -->