'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Timesheet = mongoose.model('Timesheet'),
    UserMap = mongoose.model('Usermap'),
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

/*
 *
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

/*
 *
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
/*
 *
 * List of Timesheets
 */
exports.list = function(req, res) { 
    var user = req.user;
    var roles = user.roles;
    var role = 'user';

    for(var i = 0; i < roles.length; i++) {
        //There can be just one admin so break if we find the role as moderator
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
    console.log("inside list");
    if(role === 'user' || role === 'admin') {
        Timesheet.find().sort('-created').populate('user', 'displayName').exec(function(err, timesheets) {
            if (err) {
                return res.status(400).send({
                    message: errorHandler.getErrorMessage(err)
                });
            } else {
                var userSheets = [];

                for(var i = 0; i < timesheets.length; i++) {
                        if (timesheets[i].user.id === req.user.id || (role === 'admin')) {       
                            userSheets.push(timesheets[i]);                      
                        } 

                }
                console.log(userSheets);
                res.jsonp(userSheets);
                return;
            }
        		
		});    
        
    } else {
        //Find the users for the moderator
        UserMap.find(function(err, maps) {
            //Evaluate each maps to get a list of users
            
            if(err) {
    			return res.status(400).send({
				                        message: errorHandler.getErrorMessage(err)
			                     });
            } else {
                var query = { $or: [] };
                var userSheets = [];
                
                for(var i = 0; i < maps.length; i++)
                {
                    
                    if(user._id.equals(maps[i].moderator))  {
                        
                        query.$or.push({user: maps[i].user});
                        
                    }
                        
                }      
                query.$or.push({user: user._id});
                Timesheet.find(query,function(err, timesheets) {                
                    if(err) {
                            return res.status(400).send({
                                            message: errorHandler.getErrorMessage(err)
                            });

                    } else {
                        for(var  i = 0; i < timesheets.length ; i++){
                            userSheets.push(timesheets[i]);
                        }
                        console.log("moderator" + userSheets);
                        res.jsonp(userSheets); 
                        return;

                    }
                });
                
            }
    
                                                                                   
            
                    
            
        });
        
    }
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
    var user = req.user;
    var roles = user.roles;
    var role = 'user';

    for(var i = 0; i < roles.length; i++) {
        //There can be just one admin so break if we find the role as moderator
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
    console.log(role);
	if (req.timesheet.user.id !== req.user.id && role !== 'admin') {       
		  return res.status(403).send('User wow is not authorized');
    }
	
	next();
};
