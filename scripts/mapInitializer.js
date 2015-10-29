var mapInitializer = {};

(function(){	
	function getUrlStart(absUrl){
		var i = 0;
		var slashCount = 0;
		var urlStart = "";
		var slash = '/';
		
		for(; i < absUrl.length; i+=1){
			if(absUrl[i] == slash){
				slashCount+=1;
				if(slashCount == 4){
					break;
				}
			}
			
			urlStart += absUrl[i];
		}
		
		urlStart += slash;
		
		return urlStart;
	}

	function drawLocations($location, map){
		var absUrl = $location.$$absUrl;
		var urlStart = getUrlStart(absUrl);
		var locationsRestUrl = "wp-en/wp-json/taxonomies/locationTaxonomy/terms";
		var url = urlStart + locationsRestUrl;
		$.get( url, function( data ) {
		var locations = data;

		for(var i = 0; i < locations.length; i+=1){
		  var coordinates = JSON.parse(locations[i].description);
		  
		  if(coordinates.length < 3){
			  continue;
		  }
		  
		  var mapCoordinates = [];			  
		  for(var index = 0; index < coordinates.length; index+=2){
			  mapCoordinates.push({lat: coordinates[index], lng: coordinates[index+1]});
		  }		
		  
		  var polygon = new google.maps.Polygon({
			paths: mapCoordinates,
			strokeColor: '#FF0000',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#FF0000',
			fillOpacity: 0.35
		  });
		  polygon.setMap(map);
		}		  
		});
	}

	mapInitializer.initMap = function($location){
		var defaultZoom = 6;
		var mapCenterCoordinates = new google.maps.LatLng(53.28984728016674, -1.91162109375);
		var mapOptions = {
			zoom: defaultZoom,
			center: mapCenterCoordinates,
			mapTypeId: google.maps.MapTypeId.HYBRID
		};
		
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		drawLocations($location, map);
	};
})();

