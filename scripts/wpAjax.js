var wpAjax = {};

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
			
	function getData($http, url, onData){
		$http.get(url).success(function(data) { onData(data) });
	}
	
	wpAjax.urlStart = getUrlStart(window.location.href);
	wpAjax.getLocations = function($http, onLocations){
		var locationsRestUrl = "wp-en/wp-json/taxonomies/locationTaxonomy/terms";
		var url = wpAjax.urlStart + locationsRestUrl;	
		getData($http, url, onLocations);
	};
	wpAjax.getLocation = function($http, slug, onLocation){
		wpAjax.getLocations($http, function(locations){
			for(var i = 0; i < locations.length; i+=1){
				if(locations[i].slug == slug){
					onLocation(locations[i]);
				}
			}
		});
	};
	function getAllCategories($http, onCategories){
		var categoriesRestUrl = "wp-en/wp-json/taxonomies/serviceTypeTaxonomy/terms";
		var url = wpAjax.urlStart + categoriesRestUrl;
		getData($http, url, function(allCategories){
			onCategories(allCategories);
		});
	};
	wpAjax.getCategories = function($http, locationSlug, parentSlug, onCategories){		
		getAllCategories($http, function(allCategories){
			var categories = [];
			if(parentSlug){
				for(var i = 0; i < allCategories.length; i+=1){
					var category = allCategories[i];
					if(category.parent && category.parent.slug == parentSlug){
						category.nextHref = wpAjax.urlStart + "#/searchResults/" + category.slug + "/location/" + locationSlug;
						categories.push(category);
					}
				}
			}
			else{
				for(var i = 0; i < allCategories.length; i+=1){
					var category = allCategories[i];
					if(!category.parent){
						category.nextHref = wpAjax.urlStart + "#/categories/" + category.slug + "/location/" + locationSlug;
						categories.push(category);
					}
				}
			}
			
			onCategories(categories);
		});
	};
	function getIfHasSameParent(category, searchedSlug, allCategories){
		hasSameParent = false;
		
		var parentSlug = category.parent ? category.parent.slug : null;
		
		while(parentSlug && !hasSameParent){
			if(parentSlug == searchedSlug){
				hasSameParent = true;
			} 
			else {
				for(var i = 0; i < allCategories.length; i+=1){
					if(allCategories[i].slug == parentSlug){
						if(allCategories[i].parent){
							parentSlug = allCategories[i].parent.slug;
						}
						else{
							parentSlug = null;
						}						
					}
				}
			}			
		}
		
		return hasSameParent;
	};
	wpAjax.getSearchResults = function($http, locationSlug, categorySlug, onResults){
		getAllCategories($http, function(allCategories){
			var searchResultsRestUrl = "wp-en/wp-json/servicePostPlugin/services";
			var url = wpAjax.urlStart + searchResultsRestUrl;
			getData($http, url, function(allServices){
				var services = [];
				
				for(var i = 0; i < allServices.length; i+=1){
					var service = allServices[i];
					
					var isSameType = false;
					var types = service.terms.serviceTypeTaxonomy;
					for(var i = 0; i < types.length && !isSameType; i+=1){
						if(types[i].slug == categorySlug || getIfHasSameParent(types[i], categorySlug, allCategories)){
							isSameType = true;
						}
					}
					
					if(!isSameType){
						continue;
					}
					
					var isSameLocation = false;
					var locations = service.terms.locationTaxonomy;
					for(var i = 0; i < locations.length && !isSameLocation; i+=1){
						if(locations[i].slug == locationSlug){
							isSameLocation = true;
						}
					}
					
					if(isSameType && isSameLocation){
						services.push(service);
					}
				}
				
				onResults(services);
			});
		});
		
		
	};
})();