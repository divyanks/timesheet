'use strict';

// Usermaps controller
angular.module('usermaps').controller('UsermapsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Usermaps',
	function($scope, $stateParams, $location, Authentication, Usermaps) {
		$scope.authentication = Authentication;

		// Create new Usermap
		$scope.create = function(userMap) {
			// Create new Usermap object
			var usermap = new Usermaps ({
				userName: userMap.userName,
                modName:userMap.modName
			});

			// Redirect after save
			usermap.$save(function(response) {
				$location.path('usermaps/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Usermap
		$scope.remove = function(usermap) {
			if ( usermap ) { 
				usermap.$remove();

				for (var i in $scope.usermaps) {
					if ($scope.usermaps [i] === usermap) {
						$scope.usermaps.splice(i, 1);
					}
				}
			} else {
				$scope.usermap.$remove(function() {
					$location.path('usermaps');
				});
			}
		};

		// Update existing Usermap
		$scope.update = function() {
			var usermap = $scope.usermap;

			usermap.$update(function() {
				$location.path('usermaps/' + usermap._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Usermaps
		$scope.find = function() {
			$scope.usermaps = Usermaps.query();
		};

		// Find existing Usermap
		$scope.findOne = function() {
			$scope.usermap = Usermaps.get({ 
				usermapId: $stateParams.usermapId
			});
		};
	}
]);