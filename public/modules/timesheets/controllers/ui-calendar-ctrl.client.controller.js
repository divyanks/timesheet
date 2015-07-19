'use strict';

angular.module('timesheets').controller('UiCalendarCtrlController', [ '$scope', '$rootScope',
	function($scope, $rootScope, $element, $attrs) {
		// Ui calendar ctrl controller logic
		// ...
         $scope.model = 0;        
          //start and end are moment objects
          $rootScope.greater_than_preferred_hours = function (day) {
                //assertion is always true:: $rootScope.start.dayOfYear() == end.dayOfYear();              
                
                var events = $rootScope.dayEvents[day];
                var totalDuration = 0;
                if(events === undefined)
                    return false;
                for(var i = 0; i < events.length; i++){
                    totalDuration += events[i].end.diff(events[i].start, 'seconds');
                }
              
                
                if(totalDuration > $rootScope.preferredNumberSeconds){
                    console.log($rootScope.preferredNumberSeconds + '' + totalDuration + 'true: greater' + day);
                    return true;
                }
                    
                else {
                    console.log($rootScope.preferredNumberSeconds + '' + totalDuration + 'false: greater' + day);
                    return false;
                }
                    
          };
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
                                                //FullCalendar: duration: start and end, ==> our Schema startTime, endTime
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
                                                    event.startTime = start.utc();
                                                    event.endTime = end.utc();
                                                    event.note = title;
                                                    if(title === undefined)
                                                        return;                                                
                                                    $rootScope.dataSource.push({
                                                                                    title:event.project,
                                                                                    start:start,
                                                                                    end:end
                                                                                }
                                                                              );
                                                    $scope.create(event);
                                                    //Add the event to appropriate day
                                                    var day = end.dayOfYear();
                                                    if($rootScope.dayEvents[day] === undefined) {
                                                        $rootScope.dayEvents[day] = [];
                                                        $rootScope.dayEvents[day].push(
                                                                    {
                                                                        title:event.project,
                                                                        start:start,
                                                                        end:end
                                                                    });
                                                        $rootScope.greater_than_preferred_hours(day);
                                                    }
                                                    else {
                                                        $rootScope.dayEvents[day].push({
                                                                         title:event.project,
                                                                        start:start,
                                                                        end:end
                                                                    });
                                                        $rootScope.greater_than_preferred_hours(day);
                                                    }                          
                                                    
                                                    
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
                                            weekends: true,
                                            dayRender: function (date, cell) {
                                                
                                                    //date is of type moment.
                                                    var day = date.dayOfYear();
                                                    //decide color of the day and make it red
                                                    if(true === $rootScope.greater_than_preferred_hours(day)) {
                                                               
                                                        //When the hours worked is more than preferred hours
                                                        console.log($rootScope.dayEvents);
                                                        
                                                    } else {
                                                        if($rootScope.dayEvents[day] !== undefined) {
                                                            //Atleast one event exists on the day
                                                            cell.css('background-color', 'red');
                                                            console.log('some should be red');
                                                        }
                                                        
                                                        console.log($rootScope.dayEvents);
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