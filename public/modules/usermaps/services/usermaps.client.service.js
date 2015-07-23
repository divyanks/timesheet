'use strict';

//Usermaps service used to communicate Usermaps REST endpoints
angular.module('usermaps').factory('Usermaps', ['$resource',
	function($resource) {
		return $resource('usermaps/:usermapId', { usermapId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);