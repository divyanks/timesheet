'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Usergrp = mongoose.model('Usergrp'),
	_ = require('lodash');

/**
 * Create a Usergrp
 */
exports.create = function(req, res) {
	var usergrp = new Usergrp(req.body);
	usergrp.user = req.user;

	usergrp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usergrp);
		}
	});
};

/**
 * Show the current Usergrp
 */
exports.read = function(req, res) {
	res.jsonp(req.usergrp);
};

/**
 * Update a Usergrp
 */
exports.update = function(req, res) {
	var usergrp = req.usergrp ;

	usergrp = _.extend(usergrp , req.body);

	usergrp.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usergrp);
		}
	});
};

/**
 * Delete an Usergrp
 */
exports.delete = function(req, res) {
	var usergrp = req.usergrp ;

	usergrp.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usergrp);
		}
	});
};

/**
 * List of Usergrps
 */
exports.list = function(req, res) { 
	Usergrp.find().sort('-created').populate('user', 'displayName').exec(function(err, usergrps) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(usergrps);
		}
	});
};

/**
 * Usergrp middleware
 */
exports.usergrpByID = function(req, res, next, id) { 
	Usergrp.findById(id).populate('user', 'displayName').exec(function(err, usergrp) {
		if (err) return next(err);
		if (! usergrp) return next(new Error('Failed to load Usergrp ' + id));
		req.usergrp = usergrp ;
		next();
	});
};

/**
 * Usergrp authorization middleware
 * Ensures moderator is doing   CRUD operations on 
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.usergrp.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
