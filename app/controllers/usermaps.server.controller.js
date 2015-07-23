'use strict';

/**
 * Module dependencies.
 */
require('./users/users.profile.server.controller');
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Usermap = mongoose.model('Usermap'),
    	User = mongoose.model('User'),
	_ = require('lodash');

/*
 *
 * Create a Usermap
 */

exports.create = function(req, res) {
	var usermap = new Usermap(req.body);
    
	usermap.author = req.user._id;
    var roles = req.user.roles;
    var role;
    for(var i = 0; i < roles.length; i++) {
        //There can be just one of admin/moderator so break if we find the role as moderator or admin
        if(roles[i] === 'admin') {
            role = 'admin';
            break;
        } else if(roles[i] === 'moderator'){
            role = 'moderator'; //If we see a moderator as role break and dont browse further the array
            break;
        } else {
            role = 'user';             
        }        
    }
    if(role === 'admin') {
    
        //Fill the user id after finding from user table
        User.findOne({username: usermap.userName},function(err, user) {
                usermap.user = user._id;
            if (err) {
                        return res.status(400).send({
                            message: errorHandler.getErrorMessage(err)
                        });
            } else {
            //Fill the moderator id after finding from user table if successfull finding the user
                User.findOne({username: usermap.modName},function(err, modUser) {
                        usermap.moderator = modUser._id;
    //                    console.log("user found" + user);
    //                    console.log("usermap filled" + usermap);
                        usermap.save(function(err) {
                        if (err) {
                            return res.status(400).send({
                                message: errorHandler.getErrorMessage(err)
                            });
                        } else {
                            res.jsonp(usermap);
                        }
                    });
                });
            }

        });
    } else {
        res.status(403).send('User is not authorized');
    }
    
};

/**
 * Show the current Usermap
 */
exports.read = function(req, res) {
	res.jsonp(req.usermap);
};

/**
 * Update a Usermap
 */
exports.update = function(req, res) {
	var usermap = req.usermap ;

	usermap = _.extend(usermap , req.body);
	
    var roles = req.user.roles;
    var role;
    for(var i = 0; i < roles.length; i++) {
        //There can be just one of admin/moderator so break if we find the role as moderator or admin
        if(roles[i] === 'admin') {
            role = 'admin';
            break;
        } else if(roles[i] === 'moderator'){
            role = 'moderator'; //If we see a moderator as role break and dont browse further the array
            break;
        } else {
            role ='user';             
        }        
    }
    if(role === 'admin') {
      usermap.save(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(usermap);
            }
        });
    } else {
        
            res.status(403).send('User is not authorized');
    } 
	
};

/**
 * Delete an Usermap
 */
exports.delete = function(req, res) {
	var usermap = req.usermap ;
    var roles = req.user.roles;
    var role;
    for(var i = 0; i < roles.length; i++) {
        //There can be just one of admin/moderator so break if we find the role as moderator or admin
        if(roles[i] === 'admin') {
            role = 'admin';
            break;
        } else if(roles[i] === 'moderator'){
            role = 'moderator'; //If we see a moderator as role break and dont browse further the array
            break;
        } else {
            role ='user';             
        }        
    }
    if(role === 'admin') {
        usermap.remove(function(err) {
            if (err) {
                return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
            } else {
                res.jsonp(usermap);
            }
        });
    } 
};

/**
 * List of Usermaps
 */
exports.list = function(req, res) {
    var roles = req.user.roles;
    var role;
    for(var i = 0; i < roles.length; i++) {
        //There can be just one of admin/moderator so break if we find the role as moderator or admin
        if(roles[i] === 'admin') {
            role = 'admin';
            break;
        } else if(roles[i] === 'moderator'){
            role = 'moderator'; //If we see a moderator as role break and dont browse further the array
            break;
        } else {
            role ='user';             
        }        
    }
    if(role === 'admin') {
        Usermap.find().sort('-created').populate('user', 'displayName').exec(function(err, usermaps) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(usermaps);
            }
        });
    } else if (role ==='moderator') {
        Usermap.find({moderator: req.user.id} ,function(err, maps) {
            if(err){
                return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
            } else {
                res.jsonp(maps);
            }
        });
        
    }
};

/**
 * Usermap middleware
 */
exports.usermapByID = function(req, res, next, id) { 
	Usermap.findById(id).populate('user', 'displayName').exec(function(err, usermap) {
		if (err) return next(err);
		if (! usermap) return next(new Error('Failed to load Usermap ' + id));
		req.usermap = usermap ;
		next();
	});
};

/**
 * Usermap authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    var roles = req.user.roles;
    var role;
    for(var i = 0; i < roles.length; i++) {
        //There can be just one of admin/moderator so break if we find the role as moderator or admin
        if(roles[i] === 'admin') {
            role = 'admin';
            break;
        } else if(roles[i] === 'moderator'){
            role = 'moderator'; //If we see a moderator as role break and dont browse further the array
            break;
        } else {
            role ='user';             
        }        
    }
    if(role !== 'admin') {
//	if (req.usermap.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
