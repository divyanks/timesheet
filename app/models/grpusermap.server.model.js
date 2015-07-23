'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Grpusermap Schema
 */
var GrpusermapSchema = new Schema({
    /*
	user: {
		type: Schema.ObjectId,
        
		ref: 'User'
        
	},
    */
    //Refers to the  member who is in the group
    member: {
		type: String,
        required: 'Please fill user schema name',
		trim: true
	},
    manager: {
		type: String,
        required: 'Please fill user schema name',
		trim: true
	},
    /*
    grp: {
        type: Schema.ObjectId,
    	
        ref:'Usergrp'
    }
    */
});

mongoose.model('Grpusermap', GrpusermapSchema);