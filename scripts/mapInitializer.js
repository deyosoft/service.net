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
	
	function convertCoordinatesFromList(coordinatesList){
		var mapCoordinates = [];			  

		  if(coordinatesList.length >= 3){
			  for(var index = 0; index < coordinatesList.length; index+=2){
				  mapCoordinates.push({lat: coordinatesList[index+1], lng: coordinatesList[index]});
			  }	
		  }
		  
		  return mapCoordinates;
	}
	
	function convertCoordinatesFromMultiArrays(coordinatesMultiArray)
	{
		var mapCoordinates = [];
		
		if(coordinatesMultiArray.length){
			var arrayOfCoordinates = coordinatesMultiArray[8][0];
			for(var index = 0; index < arrayOfCoordinates.length; index+=1){
				var coords = arrayOfCoordinates[index];
				mapCoordinates.push({lat: coords[1], lng: coords[0]});
			}	
		}
		
		return mapCoordinates;
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
		  		  
		  var mapCoordinates = convertCoordinatesFromList(coordinates);
		  //var mapCoordinates = convertCoordinatesFromMultiArrays(coordinates);
		  
		  if(mapCoordinates.length == 0){
			  continue;
		  }
		  
		  var polygon = new google.maps.Polygon({
			paths: mapCoordinates,
			strokeColor: '#115140',
			strokeOpacity: 0.8,
			strokeWeight: 2,
			fillColor: '#115140',
			fillOpacity: 0.35
		  });
		  polygon.setMap(map);
		}		  
		});
	}

	mapInitializer.initMap = function($location){
		var defaultZoom = 6;
		var mapCenterCoordinates = new google.maps.LatLng(53.28984728016674, -1.91162109375);
		var style_England = [
			{ "featureType": "water", "stylers": [ { "visibility": "simplified" }, { "color": "#67b8df" } ] },
			{ "featureType": "transit", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "road", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "poi", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative.land_parcel", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative.neighborhood", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative.province", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative.country", "stylers": [ { "visibility": "simplified" } ] },
			{ "featureType": "administrative.locality", "elementType": "geometry", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative.locality", "elementType": "labels", "stylers": [ { "visibility": "simplified" } ] },
			{ "featureType": "landscape.man_made", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "landscape.natural", "stylers": [ { "visibility": "simplified" }, { "color": "#ffffff" } ] }
		];
		var England = new google.maps.StyledMapType(style_England, {name: "England style"});
		var mapOptions = {
			zoom: defaultZoom,
			center: mapCenterCoordinates,
			panControl: false,
			mapTypeControl: false,
			mapTypeControlOptions: {
				mapTypeIds: ['map_styles_England']
			}
		};
		var map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
		map.mapTypes.set('map_styles_England', England);
		map.setMapTypeId('map_styles_England');
		drawLocations($location, map);
	};
})();

