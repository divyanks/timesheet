'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication',//'Dataservice',
	function($scope, Authentication){//, Dataservice) {
		// This provides Authentication context.
		$scope.authentication = Authentication;
	//	$scope.dataService = Dataservice;
	}
]);