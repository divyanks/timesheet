'use strict';

angular.module('timesheets').controller('UiCalendarCtrlController', [ '$scope', '$rootScope',
	function($scope, $rootScope, $element, $attrs) {
		// Ui calendar ctrl controller logic
		// ...
         $scope.model = 0;        
          
          $rootScope.calendar = function () {
              $(function () {
                  
                // wait till load event fires so all resources are available
                  $scope.calendar =	$('#calendar').fullCalendar({
											editable: true,
											weekMode: 'liquid',
											url:'#',
                                            selectable: true,
                                            select: function(start, end, allDay)
                                            {
                                                    /*
                                                     *    after selection user will be promted for enter title for event.
                                                    */
                                                    var title = prompt('Event Title:');
                                                    /*
                                                     *    if title is enterd calendar will add title and event into fullCalendar.
                                                    */
                                                    if (title)
                                                    {
                                                        $('#calendar').fullCalendar('renderEvent',
                                                            {
                                                                title: title,
                                                                start: start,
                                                                end: end
                                                                
                                                            },
                                                            true // make the event "stick"
                                                        );
                                                    }
                                                    var event = {};
                                                    event.name = title;
                                                    event.project = title;
                                                    event.startTime = start.utc();;
                                                    event.endTime = end.utc();;
                                                    event.note = title;                                                    
                                                    $rootScope.dataSource.push({
                                                                                title:event.project,
                                                                                start:start,
                                                                                end:end}
                                                                              );
                                                    $scope.create(event);
                                                    $('#calendar').fullCalendar('refetchEvents');
                                                    $('#calendar').fullCalendar('unselect');
                                                    
                                                    
                                            },
                                            header: { center: 'month,agendaWeek' }, // buttons for switching between views

                                            views: {
                                                month: { // name of view
                                                    titleFormat: 'YYYY/MM/DD'
                                                    // other view-specific options here
                                                }
                                            },
                                            events: $rootScope.dataSource
                                        });
              });

              $scope.onSlide = function (e, ui) {
                 $scope.model = ui.value;
                 $scope.$digest();
              };
          };
          
          $rootScope.calendar();
	}
]);