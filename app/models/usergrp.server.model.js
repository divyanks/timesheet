'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Usergrp Schema
 */
var UsergrpSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Usergrp name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    //Refers to moderation added to easy user/group and group management 
    displayName: {
		type: String,
        required: 'Please fill user schema name',
		trim: true
	},
    //Refers to the moderator
    /*
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    }
    */
});

mongoose.model('Usergrp', UsergrpSchema);