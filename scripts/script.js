// create the module and name it navigateFormApp
var navigateFormApp = angular.module('navigateFormApp', ['ngRoute']);

(function(){
	var routes = {
		home : "/",
		location : "/location",
		service : "/service",
		results: "/results"
	};
	
	// configure our routes
	navigateFormApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when(routes.home, {
				templateUrl : 'pages/home.html',
				controller  : 'homeController'
			})

			// route for the location page
			.when(routes.location, {
				templateUrl : 'pages/location.html',
				controller  : 'locationController'
			})

			// route for the service page
			.when(routes.service, {
				templateUrl : 'pages/service.html',
				controller  : 'serviceController'
			})

			// route for the results page
			.when(routes.results, {
				templateUrl : 'pages/results.html',
				controller  : 'resultsController'
			});
	});
	
	function setNextPrevious($scope, previous, next){		
		if(previous){
			$scope.hidePrevious = "";
			$scope.previousButtonLink = "#" + previous;
		}
		else{
			$scope.hidePrevious = "ng-hide";
		}
		
		if(next){
			$scope.hideNext = "";
			$scope.nextButtonLink = "#" + next;
		}
		else{
			$scope.hideNext = "ng-hide";
		}
	};

	// create the controller and inject Angular's $scope
	navigateFormApp.controller('mainController', function($scope) {
	});
	
	navigateFormApp.controller('homeController', ['$scope', '$location', function($scope, $location) {
		// create a message to display in our view
		$scope.message = 'homeController';
		$scope.$on('$viewContentLoaded', function() {
			mapInitializer.initMap($location);			
		});
		setNextPrevious($scope.$parent, null, null);
	}]);

	navigateFormApp.controller('locationController', function($scope) {
		$scope.message = 'locationController';
		setNextPrevious($scope.$parent, null, routes.service);
	});

	navigateFormApp.controller('serviceController', function($scope) {
		$scope.message = 'serviceController';
		setNextPrevious($scope.$parent, routes.location, routes.results);
	});

	navigateFormApp.controller('resultsController', function($scope) {
		$scope.message = 'resultsController';
		setNextPrevious($scope.$parent, routes.service, null)
	});
})();