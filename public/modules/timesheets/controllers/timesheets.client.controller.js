'use strict';

// Timesheets controller
angular.module('timesheets').controller('TimesheetsController', ['$scope', '$rootScope', '$stateParams', '$location', 'Authentication', 'Timesheets',
	function($scope, $rootScope, $stateParams, $location, Authentication, Timesheets) {
		$scope.authentication = Authentication;
        
        function compare(a,b) {
              if (a.startTime < b.startTime)
                return -1;
              if (a.startTime > b.startTime)
                return 1;
              return 0;
            }
        
        
        
        $rootScope.setupEventDay = function () {
              
            $rootScope.eventDay = [];
            //Check if each record is of same day as the next one
            for(var i = 0; i < $rootScope.gSheets.length; i++ )
            {
                     var event = $rootScope.gSheets[i];
                    
                     var day = moment(event.endTime).dayOfYear();
                    if($rootScope.eventDay[day] === undefined) {
                        $rootScope.eventDay[day] = [];
                        $rootScope.eventDay[day] = $rootScope.gSheets[i].duration;
                    } else {
                         $rootScope.eventDay[day] += $rootScope.gSheets[i].duration;
                    }                   
            }     
            
        };
        
		// Create new Timesheet
		$scope.create = function(sheet) {
			// Create new Timesheet object

            var duration = moment(sheet.end).diff(moment(sheet.start), "hours")
            var timesheet = new Timesheets({
                                    
                                    name:sheet.project,
                                    startTime:moment(sheet.start).utc(),
                                    endTime:moment(sheet.end).utc(),
                                    duration: duration,
                                    note:sheet.note,
                                    });
            
          

			// Redirect after save
			timesheet.$save(function(response) {
			//	$location.path('timesheets/');
                timesheet.user = Authentication.user;
                $rootScope.gSheets.push(timesheet);
                
                $rootScope.setupEventDay();	
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
				//	$location.path('timesheets');
				});
			}
		};

		// Update existing Timesheet
		$scope.update = function(timesheet) {
			
			    timesheet.$update(function() {
				//$location.path('timesheets/' + timesheet._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Timesheets
		$scope.find = function() {
			$scope.timesheets = Timesheets.query(function(){
                      $rootScope.gSheets = $scope.timesheets;
                        console.log($rootScope.gSheets);
                $rootScope.setupEventDay();
                console.log($rootScope.eventDay);
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