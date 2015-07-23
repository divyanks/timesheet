'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
var   User = mongoose.model('User');

/**
 * Usermap Schema
 */
var UsermapSchema = new Schema({
     modName: {
                type: String,
		default: '',
		required: 'Please fill moderator name',
		trim: true
	},
        
  
	moderator: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	created: {
		type: Date,
		default: Date.now
	},
    author: {
		  type: String,
		default: '',
		
		trim: true
	},
    userName: {
		          type: String,
		default: '',
		required: 'Please fill moderator name',
		trim: true
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Usermap', UsermapSchema);