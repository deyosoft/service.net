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
	
	wpAjax.getPostsPerPage = function() { return 100; };
	wpAjax.urlStart = getUrlStart(window.location.href);
			
	function getData($http, url, onData){
		$http.get(url).success(function(data) { onData(data) });
	}
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
					break;
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
	wpAjax.getCategory = function($http, slug, onCategory){
		getAllCategories($http, function(allCategories){
			for(var i = 0; i < allCategories.length; i+=1){
				if(allCategories[i].slug == slug){
					onCategory(allCategories[i]);
					break;
				}
			}
		});
	}
	function buildCategoriesParentTree(allCategories){
		var tree = {};
		
		for(var i = 0; i < allCategories.length; i+=1){
			var category = allCategories[i];
			tree[category.slug] = category.parent;
		}
		
		return tree;
	}
	
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
	function getIfHasSameSlugRecursively(slug, searchedSlug, parentsTree){		
		var currentSlug = slug;
		var hasSameParent = false;
		
		while(currentSlug && !hasSameParent){
			if(currentSlug == searchedSlug){
				hasSameParent = true;
			} 
			else {
				var parentElement = parentsTree[currentSlug];
				currentSlug = parentElement ? parentElement.slug : null;
			}			
		}
		
		return hasSameParent;
	};
	wpAjax.getSearchResults = function($http, locationSlug, categorySlug, pageIndex, onResults){
		getAllCategories($http, function(allCategories){
			var categoriesTree = buildCategoriesParentTree(allCategories);
			var postsPerPageFilter = 'filter[posts_per_page]=' + wpAjax.getPostsPerPage();
			var offsetFilter = 'filter[offset]=' + pageIndex * wpAjax.getPostsPerPage();
			var searchResultsRestUrl = "wp-en/wp-json/servicePostPlugin/services?" + postsPerPageFilter + "&" + offsetFilter;
			var url = wpAjax.urlStart + searchResultsRestUrl;
			
			getData($http, url, function(allServices){
				var services = [];
				
				for(var i = 0; i < allServices.length; i+=1){
					var service = allServices[i];
					
					var isSameType = false;
					var types = service.terms.serviceTypeTaxonomy;
					for(var j = 0; j < types.length && !isSameType; j+=1){
						if(getIfHasSameSlugRecursively(types[j].slug, categorySlug, categoriesTree)){
							isSameType = true;
						}
					}
					
					if(!isSameType){
						continue;
					}
					
					var isSameLocation = false;
					var locations = service.terms.locationTaxonomy;
					for(var k = 0; k < locations.length && !isSameLocation; k+=1){
						if(locations[k].slug == locationSlug){
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