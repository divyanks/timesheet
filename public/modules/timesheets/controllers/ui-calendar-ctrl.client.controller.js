'use strict';

angular.module('timesheets').controller('UiCalendarCtrlController', [ '$scope', 
	function($scope, $element, $attrs) {
		// Ui calendar ctrl controller logic
		// ...
         $scope.model = 0;
         $scope.eventSource= [];
 
          $scope.calendar = function () {
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
                                                        after selection user will be promted for enter title for event.
                                                    */
                                                    var title = prompt('Event Title:');
                                                    /*
                                                        if title is enterd calendar will add title and event into fullCalendar.
                                                    */
                                                    if (title)
                                                    {
                                                        $('#calendar').fullCalendar('renderEvent',
                                                            {
                                                                title: title,
                                                                start: start,
                                                                end: end,
                                                                allDay: allDay
                                                            },
                                                            true // make the event "stick"
                                                        );
                                                    }
                                                    var event = {};
                                                    event.project = title;
                                                    event.startTime = start;
                                                    event.endTime = end;
                                                    event.note = title;
                                                    $scope.eventSource.push(event);
                                                
                                                    $('#calendar').fullCalendar('refetchEvents');
                                                    $('#calendar').fullCalendar('unselect');
                                                    $scope.create(event);
                                                    alert($scope.eventSource);
                                            },
                                            header: { center: 'month,agendaWeek' }, // buttons for switching between views

                                            views: {
                                                month: { // name of view
                                                    titleFormat: 'YYYY, MM, DD'
                                                    // other view-specific options here
                                                }
                                            },
                                            events: $scope.eventSource
                                        });
              });

              $scope.onSlide = function (e, ui) {
                 $scope.model = ui.value;
                 $scope.$digest();
              };
          };
          
          $scope.calendar();
	}
]);