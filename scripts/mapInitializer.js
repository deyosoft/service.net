var mapInitializer = {};

(function(){	
	
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

	function drawLocations($http, map){				
		wpAjax.getLocations($http, function(locations) {	
			var infoBox = new InfoBox();
			
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
				
				(function(categoriesUrl, infoText){
					google.maps.event.addListener(polygon,"mouseover",function(e){ 
						this.setOptions({fillOpacity: 0.8}); 
						infoBox.setOptions({
							content: infoText,
							boxStyle: {
							   border: "1px solid black",
							   background: "#ffffff",
							   textAlign: "center",
							   fontSize: "14pt",
							   'width': "120px",
							 },
							 disableAutoPan: true,
							 position: e.latLng,
							 closeBoxURL: "",
							 isHidden: false,
							 pane: "mapPane",
							 enableEventPropagation: true,
						});
						infoBox.open(map);
					}); 
					google.maps.event.addListener(polygon,"mouseout",function(){
						this.setOptions({fillOpacity: 0.35}); 
						infoBox.close();
					});
					google.maps.event.addListener(polygon,"click",function(){ 
						window.location.href = categoriesUrl; 
					}); 
				  
					polygon.setMap(map);
				})(
						wpAjax.urlStart + "#/categories/location/" + locations[i].slug,
						locations[i].name
					);
			}	  
		});
	}

	mapInitializer.initMap = function($http){
		var defaultZoom = 6;
		var mapCenterCoordinates = new google.maps.LatLng(53.28984728016674, -1.91162109375);
		var style_England = [
			{ "featureType": "water", "stylers": [ { "visibility": "simplified" }, { "color": "#67b8df" } ] },
			{ "featureType": "transit", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "road", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "poi", "stylers": [ { "visibility": "off" } ] },
			{ "featureType": "administrative", "stylers": [ { "visibility": "off" } ] },
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
		drawLocations($http, map);
	};
})();

