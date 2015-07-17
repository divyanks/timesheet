'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var timesheets = require('../../app/controllers/timesheets.server.controller');

	// Timesheets Routes
	app.route('/timesheets')
		.get(timesheets.list)
		.post(users.requiresLogin, timesheets.create);

	app.route('/timesheets/:timesheetId')
		.get(timesheets.read)
		.put(users.requiresLogin, timesheets.hasAuthorization, timesheets.update)
		.delete(users.requiresLogin, timesheets.hasAuthorization, timesheets.delete);

	// Finish by binding the Timesheet middleware
	app.param('timesheetId', timesheets.timesheetByID);
};
