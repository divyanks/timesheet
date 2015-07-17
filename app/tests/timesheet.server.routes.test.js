'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Timesheet = mongoose.model('Timesheet'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, timesheet;

/**
 * Timesheet routes tests
 */
describe('Timesheet CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Timesheet
		user.save(function() {
			timesheet = {
				name: 'Timesheet Name'
			};

			done();
		});
	});

	it('should be able to save Timesheet instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timesheet
				agent.post('/timesheets')
					.send(timesheet)
					.expect(200)
					.end(function(timesheetSaveErr, timesheetSaveRes) {
						// Handle Timesheet save error
						if (timesheetSaveErr) done(timesheetSaveErr);

						// Get a list of Timesheets
						agent.get('/timesheets')
							.end(function(timesheetsGetErr, timesheetsGetRes) {
								// Handle Timesheet save error
								if (timesheetsGetErr) done(timesheetsGetErr);

								// Get Timesheets list
								var timesheets = timesheetsGetRes.body;

								// Set assertions
								(timesheets[0].user._id).should.equal(userId);
								(timesheets[0].name).should.match('Timesheet Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Timesheet instance if not logged in', function(done) {
		agent.post('/timesheets')
			.send(timesheet)
			.expect(401)
			.end(function(timesheetSaveErr, timesheetSaveRes) {
				// Call the assertion callback
				done(timesheetSaveErr);
			});
	});

	it('should not be able to save Timesheet instance if no name is provided', function(done) {
		// Invalidate name field
		timesheet.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timesheet
				agent.post('/timesheets')
					.send(timesheet)
					.expect(400)
					.end(function(timesheetSaveErr, timesheetSaveRes) {
						// Set message assertion
						(timesheetSaveRes.body.message).should.match('Please fill Timesheet name');
						
						// Handle Timesheet save error
						done(timesheetSaveErr);
					});
			});
	});

	it('should be able to update Timesheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timesheet
				agent.post('/timesheets')
					.send(timesheet)
					.expect(200)
					.end(function(timesheetSaveErr, timesheetSaveRes) {
						// Handle Timesheet save error
						if (timesheetSaveErr) done(timesheetSaveErr);

						// Update Timesheet name
						timesheet.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Timesheet
						agent.put('/timesheets/' + timesheetSaveRes.body._id)
							.send(timesheet)
							.expect(200)
							.end(function(timesheetUpdateErr, timesheetUpdateRes) {
								// Handle Timesheet update error
								if (timesheetUpdateErr) done(timesheetUpdateErr);

								// Set assertions
								(timesheetUpdateRes.body._id).should.equal(timesheetSaveRes.body._id);
								(timesheetUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Timesheets if not signed in', function(done) {
		// Create new Timesheet model instance
		var timesheetObj = new Timesheet(timesheet);

		// Save the Timesheet
		timesheetObj.save(function() {
			// Request Timesheets
			request(app).get('/timesheets')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Timesheet if not signed in', function(done) {
		// Create new Timesheet model instance
		var timesheetObj = new Timesheet(timesheet);

		// Save the Timesheet
		timesheetObj.save(function() {
			request(app).get('/timesheets/' + timesheetObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', timesheet.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Timesheet instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Timesheet
				agent.post('/timesheets')
					.send(timesheet)
					.expect(200)
					.end(function(timesheetSaveErr, timesheetSaveRes) {
						// Handle Timesheet save error
						if (timesheetSaveErr) done(timesheetSaveErr);

						// Delete existing Timesheet
						agent.delete('/timesheets/' + timesheetSaveRes.body._id)
							.send(timesheet)
							.expect(200)
							.end(function(timesheetDeleteErr, timesheetDeleteRes) {
								// Handle Timesheet error error
								if (timesheetDeleteErr) done(timesheetDeleteErr);

								// Set assertions
								(timesheetDeleteRes.body._id).should.equal(timesheetSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Timesheet instance if not signed in', function(done) {
		// Set Timesheet user 
		timesheet.user = user;

		// Create new Timesheet model instance
		var timesheetObj = new Timesheet(timesheet);

		// Save the Timesheet
		timesheetObj.save(function() {
			// Try deleting Timesheet
			request(app).delete('/timesheets/' + timesheetObj._id)
			.expect(401)
			.end(function(timesheetDeleteErr, timesheetDeleteRes) {
				// Set message assertion
				(timesheetDeleteRes.body.message).should.match('User is not logged in');

				// Handle Timesheet error error
				done(timesheetDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Timesheet.remove().exec();
		done();
	});
});