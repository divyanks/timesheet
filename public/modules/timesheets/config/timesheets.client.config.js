'use strict';

// Configuring the Timesheets module
angular.module('timesheets').run(['Menus','$rootScope',
	function(Menus, $rootScope) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Timesheets', 'timesheets', 'dropdown', '/timesheets(/create)?');
		Menus.addSubMenuItem('topbar', 'timesheets', 'List Timesheets', 'timesheets');
		Menus.addSubMenuItem('topbar', 'timesheets', 'New Timesheet', 'timesheets/create');
        $rootScope.dataSource = [];
        //Day wise events array eg: dayEvent[205] = []; represensts events occuring on 24 july of the year
        $rootScope.dayEvents = []; 
        $rootScope.preferredNumberSeconds = 4*60*60;
	}
]);