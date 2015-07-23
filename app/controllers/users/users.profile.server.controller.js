'use strict';

/*
 *
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller.js'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
    UserMap = mongoose.model('Usermap');

/*
 *
 * Update user details
 */
exports.update = function(req, res) {
	// Init Variables
	var user = req.user;
	var message = null;

	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	if (user) {
		// Merge existing user
		user = _.extend(user, req.body);
		user.updated = Date.now();
		user.displayName = user.firstName + ' ' + user.lastName;

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	} else {
		res.status(400).send({
			message: 'User is not signed in'
		});
	}
};

/*
 *
 * Send User
 */
exports.me = function(req, res) {
	res.json(req.user || null);
};
/*
 * Get users
 *
 */
exports.list = function (req, res) {
    var roles = req.user.roles;
    var user = req.user;
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
    if(role==='admin'){
        

            User.find().exec(function(err, users) {
                if (err) {
                    
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    res.jsonp(users);
                }
            });
    }
    if(role === 'moderator') {
        UserMap.find({moderator: user.id }).exec(function(err, maps){
            if (err) {
                    console.log("error in finding");
                    return res.status(400).send({
                        message: errorHandler.getErrorMessage(err)
                    });
                } else {
                    var query = { $or: [] };
                    
                    for(var i = 0; i < maps.length; i++){
                        
                        query.$or.push({_id:maps[i].user});
                    }
                  
                    User.find(query, function (err, usersManaged){
                        res.jsonp(usersManaged);
                        
                    });
                    
                    
                }
        }) ;
    }
    
};
exports.delete = function (req, res) {
    var user = req.user;
    var roles = req.user.roles;
    var zombieUser = req.body;
    
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
    console.log(zombieUser); 	
    if(role === 'admin')
        zombieUser.remove(function(err) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                res.jsonp(zombieUser);
            }
        });
    
};
 