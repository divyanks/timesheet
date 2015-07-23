'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Usermap = mongoose.model('Usermap'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, usermap;

/**
 * Usermap routes tests
 */
describe('Usermap CRUD tests', function() {
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

		// Save a user to the test db and create new Usermap
		user.save(function() {
			usermap = {
				name: 'Usermap Name'
			};

			done();
		});
	});

	it('should be able to save Usermap instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usermap
				agent.post('/usermaps')
					.send(usermap)
					.expect(200)
					.end(function(usermapSaveErr, usermapSaveRes) {
						// Handle Usermap save error
						if (usermapSaveErr) done(usermapSaveErr);

						// Get a list of Usermaps
						agent.get('/usermaps')
							.end(function(usermapsGetErr, usermapsGetRes) {
								// Handle Usermap save error
								if (usermapsGetErr) done(usermapsGetErr);

								// Get Usermaps list
								var usermaps = usermapsGetRes.body;

								// Set assertions
								(usermaps[0].user._id).should.equal(userId);
								(usermaps[0].name).should.match('Usermap Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Usermap instance if not logged in', function(done) {
		agent.post('/usermaps')
			.send(usermap)
			.expect(401)
			.end(function(usermapSaveErr, usermapSaveRes) {
				// Call the assertion callback
				done(usermapSaveErr);
			});
	});

	it('should not be able to save Usermap instance if no name is provided', function(done) {
		// Invalidate name field
		usermap.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usermap
				agent.post('/usermaps')
					.send(usermap)
					.expect(400)
					.end(function(usermapSaveErr, usermapSaveRes) {
						// Set message assertion
						(usermapSaveRes.body.message).should.match('Please fill Usermap name');
						
						// Handle Usermap save error
						done(usermapSaveErr);
					});
			});
	});

	it('should be able to update Usermap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usermap
				agent.post('/usermaps')
					.send(usermap)
					.expect(200)
					.end(function(usermapSaveErr, usermapSaveRes) {
						// Handle Usermap save error
						if (usermapSaveErr) done(usermapSaveErr);

						// Update Usermap name
						usermap.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Usermap
						agent.put('/usermaps/' + usermapSaveRes.body._id)
							.send(usermap)
							.expect(200)
							.end(function(usermapUpdateErr, usermapUpdateRes) {
								// Handle Usermap update error
								if (usermapUpdateErr) done(usermapUpdateErr);

								// Set assertions
								(usermapUpdateRes.body._id).should.equal(usermapSaveRes.body._id);
								(usermapUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Usermaps if not signed in', function(done) {
		// Create new Usermap model instance
		var usermapObj = new Usermap(usermap);

		// Save the Usermap
		usermapObj.save(function() {
			// Request Usermaps
			request(app).get('/usermaps')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Usermap if not signed in', function(done) {
		// Create new Usermap model instance
		var usermapObj = new Usermap(usermap);

		// Save the Usermap
		usermapObj.save(function() {
			request(app).get('/usermaps/' + usermapObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', usermap.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Usermap instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Usermap
				agent.post('/usermaps')
					.send(usermap)
					.expect(200)
					.end(function(usermapSaveErr, usermapSaveRes) {
						// Handle Usermap save error
						if (usermapSaveErr) done(usermapSaveErr);

						// Delete existing Usermap
						agent.delete('/usermaps/' + usermapSaveRes.body._id)
							.send(usermap)
							.expect(200)
							.end(function(usermapDeleteErr, usermapDeleteRes) {
								// Handle Usermap error error
								if (usermapDeleteErr) done(usermapDeleteErr);

								// Set assertions
								(usermapDeleteRes.body._id).should.equal(usermapSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Usermap instance if not signed in', function(done) {
		// Set Usermap user 
		usermap.user = user;

		// Create new Usermap model instance
		var usermapObj = new Usermap(usermap);

		// Save the Usermap
		usermapObj.save(function() {
			// Try deleting Usermap
			request(app).delete('/usermaps/' + usermapObj._id)
			.expect(401)
			.end(function(usermapDeleteErr, usermapDeleteRes) {
				// Set message assertion
				(usermapDeleteRes.body.message).should.match('User is not logged in');

				// Handle Usermap error error
				done(usermapDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Usermap.remove().exec();
		done();
	});
});