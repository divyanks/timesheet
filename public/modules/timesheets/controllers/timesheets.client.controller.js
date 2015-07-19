'use strict';

// Timesheets controller
angular.module('timesheets').controller('TimesheetsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Timesheets',
	function($scope, $rootScope, $stateParams, $location, Authentication, Timesheets) {
		$scope.authentication = Authentication;
        
        
		// Create new Timesheet
		$scope.create = function(sheet) {
			// Create new Timesheet object
/*            
            var start = new Date();
            var end = new Date();
            
            
			var timesheet = new Timesheets ({
				name: this.name,
                project:this.timesheet.project,
                startTime:start,
                endTime:end,
                note:this.timesheet.note
			});
            */
            var timesheet = new Timesheets({
                                    name:sheet.name, 
                                    project:sheet.name,
                                    startTime:sheet.startTime,
                                    endTime:sheet.endTime,
                                    note:sheet.note
                                    });

			// Redirect after save
			timesheet.$save(function(response) {
				$location.path('timesheets/' + response._id);
                    alert('success');
				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
                alert('failure');
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Timesheet
		$scope.remove = function(timesheet) {
			if ( timesheet ) { 
				timesheet.$remove();

				for (var i in $scope.timesheets) {
					if ($scope.timesheets [i] === timesheet) {
						$scope.timesheets.splice(i, 1);
					}
				}
			} else {
				$scope.timesheet.$remove(function() {
					$location.path('timesheets');
				});
			}
		};

		// Update existing Timesheet
		$scope.update = function() {
			var timesheet = $scope.timesheet;

			    timesheet.$update(function() {
				$location.path('timesheets/' + timesheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};
//Prepares/Populates dayEvents from dataSource (required to pass to fullcalendar)
 $rootScope.arrangeMomentsDate= function() {

            console.log($rootScope.dataSource);                                            

            var maxEvents = $rootScope.dataSource.length;
            for(var i = 0; i < maxEvents; i++) {
                var day = $rootScope.dataSource[i].end.dayOfYear();
                var  tmp = $rootScope.dataSource[i];
                if($rootScope.dayEvents[day] === undefined) {
                    $rootScope.dayEvents[day] = [];
                    $rootScope.dayEvents[day].push(tmp); 
                   
                }
                else {
                    $rootScope.dayEvents[day].push(tmp);
                   
                }   
            }
  
            console.log($rootScope.dayEvents);

    
};
		// Find a list of Timesheets
		$scope.find = function() {
			$scope.timesheets = Timesheets.query(function () {
                
                           $rootScope.dataSource = [];
                            for (var i = 0; i < $scope.timesheets.length; i++) {
                
                            var tmp = $scope.timesheets[i];
                            $scope.dataSource.push(
                                            {
                                                title:tmp.name,
                                                start:moment(tmp.startTime),
                                                end:moment(tmp.endTime),
                                                
                                            }
                            );
                           
                        }                
                    $rootScope.arrangeMomentsDate();
                    $rootScope.calendar();
            });            
 
		};

		// Find existing Timesheet
		$scope.findOne = function() {
			$scope.timesheet = Timesheets.get({ 
				timesheetId: $stateParams.timesheetId
			});
		};
	}
]);