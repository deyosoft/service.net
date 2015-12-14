// create the module and name it navigateFormApp
var navigateFormApp = angular.module('navigateFormApp', ['ngRoute']);

(function(){
	var routeVariables = {
		locationId : "location",
		categoryId : "category",
	};
	var routes = {
		home : "/",
		categories : "/categories/location/:"+routeVariables.locationId,
		subcategories: "/categories/:"+routeVariables.categoryId+"/location/:"+routeVariables.locationId,
		results: "/searchResults/:" + routeVariables.categoryId+"/location/:"+routeVariables.locationId,
	};
	var routeControllers = {
		home : 'homeController',
		categories : 'categoriesController',
		results : 'resultsController',
	};
	
	// configure our routes
	navigateFormApp.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
		$routeProvider

			// route for the home page
			.when(routes.home, {
				templateUrl : 'pages/home.html',
				controller  : routeControllers.home,
			})

			// route for the categories in location page
			.when(routes.categories, {
				templateUrl : 'pages/categories.html',
				controller  : routeControllers.categories
			})
						
			// route for the categories in location page
			.when(routes.subcategories, {
				templateUrl : 'pages/categories.html',
				controller  : routeControllers.categories
			})

			// route for the results page
			.when(routes.results, {
				templateUrl : 'pages/searchResults.html',
				controller  : routeControllers.results
			})

			.otherwise({
		        redirectTo: routes.home
		    });

			// Rewrites settings in server needed to work with html5mode! 
			// See this link: https://github.com/angular-ui/ui-router/wiki/Frequently-Asked-Questions#how-to-configure-your-server-to-work-with-html5mode		
			// $locationProvider.html5Mode(true);
	}]);

	// create the controller and inject Angular's $scope
	navigateFormApp.controller('mainController', function($scope) {
	});
	
	navigateFormApp.controller(routeControllers.home, ['$scope', '$http', function($scope, $http) {
		// create a message to display in our view
		$scope.message = routeControllers.home;
		$scope.$on('$viewContentLoaded', function() {			
			mapInitializer.initMap($http);
		});
	}]);

	navigateFormApp.controller(routeControllers.categories, ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
		$scope.message = routeControllers.categories;
		var locationSlug = $routeParams[routeVariables.locationId];
		var categorySlug = $routeParams[routeVariables.categoryId];
		
		if(categorySlug){
			wpAjax.getCategory($http, categorySlug, function(categoryJson){
				$scope["serviceDescription"] = categoryJson.name + " service subcategory";
			});
		}
		else{
			$scope["serviceDescription"] = "service category"
		}
		
		wpAjax.getLocation($http, locationSlug, function(locationJson){
			$scope["locationName"] = locationJson.name;
		});
		wpAjax.getCategories($http, locationSlug, categorySlug, function(categories){
			$scope["categories"] = categories;
		});
	}]);

	navigateFormApp.controller(routeControllers.results, ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
		$scope.message = routeControllers.results;
		var locationSlug = $routeParams[routeVariables.locationId];
		var categorySlug = $routeParams[routeVariables.categoryId];
		var pageIndex = 0;	
		wpAjax.getLocation($http, locationSlug, function(locationJson){
			$scope["locationName"] = locationJson.name;
		});
		wpAjax.getCategory($http, categorySlug, function(categoryJson){
			$scope["categoryName"] = categoryJson.name;
		});
		wpAjax.getSearchResults($http, locationSlug, categorySlug, pageIndex, function(services){
			$scope["services"] = services;
		});
	}]);
})();