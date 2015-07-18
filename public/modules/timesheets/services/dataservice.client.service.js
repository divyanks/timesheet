'use strict';

angular.module('timesheets').factory('Dataservice', [
	function() {
		// Dataservice service logic
		// ...
		var _this = this;
     
		_this._data = {
			user: window.user
		};

		return _this._data;
	//	return _this._data;
		// Public API
/*		return {
			getSource: function() {
				return eventSource;
			}
            
		};*/
	}
]);