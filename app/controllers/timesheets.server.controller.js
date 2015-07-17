'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Timesheet = mongoose.model('Timesheet'),
	_ = require('lodash');

/**
 * Create a Timesheet
 */
exports.create = function(req, res) {
	var timesheet = new Timesheet(req.body);
	timesheet.user = req.user;

	timesheet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * Show the current Timesheet
 */
exports.read = function(req, res) {
	res.jsonp(req.timesheet);
};

/**
 * Update a Timesheet
 */
exports.update = function(req, res) {
	var timesheet = req.timesheet ;

	timesheet = _.extend(timesheet , req.body);

	timesheet.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * Delete an Timesheet
 */
exports.delete = function(req, res) {
	var timesheet = req.timesheet ;

	timesheet.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheet);
		}
	});
};

/**
 * List of Timesheets
 */
exports.list = function(req, res) { 
	Timesheet.find().sort('-created').populate('user', 'displayName').exec(function(err, timesheets) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(timesheets);
		}
	});
};

/**
 * Timesheet middleware
 */
exports.timesheetByID = function(req, res, next, id) { 
	Timesheet.findById(id).populate('user', 'displayName').exec(function(err, timesheet) {
		if (err) return next(err);
		if (! timesheet) return next(new Error('Failed to load Timesheet ' + id));
		req.timesheet = timesheet ;
		next();
	});
};

/**
 * Timesheet authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.timesheet.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
