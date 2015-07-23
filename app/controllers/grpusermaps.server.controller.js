'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Grpusermap = mongoose.model('Grpusermap'),
	_ = require('lodash');

/**
 * Create a Grpusermap
 */
exports.create = function(req, res) {
	var grpusermap = new Grpusermap(req.body);
	grpusermap.user = req.user;

	grpusermap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grpusermap);
		}
	});
};

/**
 * Show the current Grpusermap
 */
exports.read = function(req, res) {
	res.jsonp(req.grpusermap);
};

/**
 * Update a Grpusermap
 */
exports.update = function(req, res) {
	var grpusermap = req.grpusermap ;

	grpusermap = _.extend(grpusermap , req.body);

	grpusermap.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grpusermap);
		}
	});
};

/**
 * Delete an Grpusermap
 */
exports.delete = function(req, res) {
	var grpusermap = req.grpusermap ;

	grpusermap.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grpusermap);
		}
	});
};

/**
 * List of Grpusermaps
 */
exports.list = function(req, res) { 
	Grpusermap.find().sort('-created').populate('user', 'displayName').exec(function(err, grpusermaps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(grpusermaps);
		}
	});
};

/**
 * Grpusermap middleware
 */
exports.grpusermapByID = function(req, res, next, id) { 
	Grpusermap.findById(id).populate('user', 'displayName').exec(function(err, grpusermap) {
		if (err) return next(err);
		if (! grpusermap) return next(new Error('Failed to load Grpusermap ' + id));
		req.grpusermap = grpusermap ;
		next();
	});
};

/**
 * Grpusermap authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.grpusermap.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
