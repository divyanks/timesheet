'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Timesheet Schema
 */
var TimesheetSchema = new Schema({
    //Name is redundant once done remove all references of it from the repo
	name: {
        type: String,
		default: '',
		required: 'Please fill Timesheet name',
		trim: true
	},
    //When refers to the day he worked on it
    startTime: {
        type:Date,  
        required: 'Please fill in the Start Time when you worked on the item',
    },
    //refers to the amount of time he has worked on the given day
    endTime: {
        type:Date,  
        required: 'Please fill end Time that you worked on the item',
    },
    //Notes is typically free flowing text on what the user has worked
    note: {
        type: String,
		default: '',
		required: 'Please fill Timesheet Notes',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
        duration: {
        type:Number       
    },
    
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Timesheet', TimesheetSchema);

