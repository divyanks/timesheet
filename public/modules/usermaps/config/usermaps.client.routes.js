'use strict';

//Setting up route
angular.module('usermaps').config(['$stateProvider',
	function($stateProvider) {
		// Usermaps state routing
		$stateProvider.
		state('listUsermaps', {
			url: '/usermaps',
			templateUrl: 'modules/usermaps/views/list-usermaps.client.view.html'
		}).
		state('createUsermap', {
			url: '/usermaps/create',
			templateUrl: 'modules/usermaps/views/create-usermap.client.view.html'
		}).
		state('viewUsermap', {
			url: '/usermaps/:usermapId',
			templateUrl: 'modules/usermaps/views/view-usermap.client.view.html'
		}).
		state('editUsermap', {
			url: '/usermaps/:usermapId/edit',
			templateUrl: 'modules/usermaps/views/edit-usermap.client.view.html'
		});
	}
]);