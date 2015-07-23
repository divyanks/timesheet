'use strict';

// Configuring the Articles module
angular.module('usermaps').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Usermaps', 'usermaps', 'dropdown', '/usermaps(/create)?');
		Menus.addSubMenuItem('topbar', 'usermaps', 'List Usermaps', 'usermaps');
		Menus.addSubMenuItem('topbar', 'usermaps', 'New Usermap', 'usermaps/create');
	}
]);