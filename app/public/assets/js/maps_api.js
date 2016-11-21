
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

        initialize(trails); 

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


      
    function initialize(trails) {

        var map;
        var bounds = new google.maps.LatLngBounds();
        var mapOptions = {
            mapTypeId: 'roadmap'
        };
                        
        // Display a map on the page
        map = new google.maps.Map(document.getElementById("map"), mapOptions);
        map.setTilt(45);
            
                          
        // Info Window Content
        var infoWindowContent = [
            ['<div class="info_content">' +
            '<h3>London Eye</h3>' +
            '<p>The London Eye is a giant Ferris wheel situated on the banks of the River Thames. The entire structure is 135 metres (443 ft) tall and the wheel has a diameter of 120 metres (394 ft).</p>' +        '</div>'],
            ['<div class="info_content">' +
            '<h3>Palace of Westminster</h3>' +
            '<p>The Palace of Westminster is the meeting place of the House of Commons and the House of Lords, the two houses of the Parliament of the United Kingdom. Commonly known as the Houses of Parliament after its tenants.</p>' +
            '</div>']
        ];
          
        var marker = [];
        // Display multiple markers on a map
        var infoWindow = new google.maps.InfoWindow(), marker, i;        
      
        // Loop through our array of markers & place each one on the map  
        for( i = 0; i < trails.length; i++ ) {
            var position = new google.maps.LatLng(trails[i].latitude, trails[i].longitude);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: trails[i].name
            });
            
            // Allow each marker to have an info window    
            google.maps.event.addListener(marker, 'click', (function(marker, i) {
                return function() {
                    infoWindow.setContent(infoWindowContent[i][0]);
                    infoWindow.open(map, marker);
                }
            })(marker, i));

            // Automatically center the map fitting all markers on the screen
            map.fitBounds(bounds);
        }

        // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
        var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
            this.setZoom(10);
            google.maps.event.removeListener(boundsListener);
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

        // var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

        //   // Clear out the old markers.
        //   markers.forEach(function(marker) {
        //     marker.setMap(null);
        //   });
        //   // markers = [];

        //   // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            // var icon = {
        //       url: place.icon,
        //       size: new google.maps.Size(71, 71),
        //       origin: new google.maps.Point(0, 0),
        //       anchor: new google.maps.Point(17, 34),
        //       scaledSize: new google.maps.Size(25, 25)
        //     };

        //     // Create a marker 
        //     markers.push(new google.maps.Marker({
        //       map: map,
        //       icon: icon,
        //       title: place.name,
        //       position: place.geometry.location
        //     }));

            // if (place.geometry.viewport) {
            //   // Only geocodes have viewport.
            //   bounds.union(place.geometry.viewport);
            // } else {
            //   bounds.extend(place.geometry.location);
            // }
          });
          map.fitBounds(bounds);
          getZip();
        });
      }

	initAutocomplete();



 }); <!-- Document ready end -->