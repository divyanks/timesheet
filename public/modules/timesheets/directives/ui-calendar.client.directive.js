'use strict';

angular.module('timesheets').directive('uiCalendar', [ 
	function() {
        return {
			templateUrl: '/modules/timesheets/views/calendar.view.html',
			restrict: 'A',
            scope:true,
            controller:'UiCalendarCtrlController',
			link: function postLink(scope, element, attrs, controller) {
				// Ui calendar directive logic
				// ...

		//		element.text('this is the uiCalendar directive');
       
                    // set up slider on load
                    angular.element(document).ready(function () {
                            var date = new Date();
							var d = date.getDate();
							var m = date.getMonth();
							var y = date.getFullYear();
                            scope.$slider =	$(element).fullCalendar({
											editable: true,
											weekMode: 'liquid',
											url:'#',
                                            events: [
                                                    {
                                                        title: 'Praent vestibulum',
                                                        start: new Date(y, m, 1, 9, 0),
                                                        end: new Date(y, m, 1, 10, 0),
                                                        allDay: false
                                                    },
                                                    {
                                                        title: 'Vestibulum iaculis lacinia',
                                                        start: new Date(y, m, 2, 16, 0),
                                                        allDay: false
                                                    },
                                                    {
                                                        title: 'Integer rutrum ante eu lacus',
                                                        start: new Date(y, m, 4, 16, 0),
                                                        allDay: false
                                                    }

                                            ]
                                        });
                        
                        
                        
                    });
                 

                
			}
		};
    }
]);