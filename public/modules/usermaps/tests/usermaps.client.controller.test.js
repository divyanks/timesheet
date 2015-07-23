'use strict';

(function() {
	// Usermaps Controller Spec
	describe('Usermaps Controller Tests', function() {
		// Initialize global variables
		var UsermapsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Usermaps controller.
			UsermapsController = $controller('UsermapsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Usermap object fetched from XHR', inject(function(Usermaps) {
			// Create sample Usermap using the Usermaps service
			var sampleUsermap = new Usermaps({
				name: 'New Usermap'
			});

			// Create a sample Usermaps array that includes the new Usermap
			var sampleUsermaps = [sampleUsermap];

			// Set GET response
			$httpBackend.expectGET('usermaps').respond(sampleUsermaps);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.usermaps).toEqualData(sampleUsermaps);
		}));

		it('$scope.findOne() should create an array with one Usermap object fetched from XHR using a usermapId URL parameter', inject(function(Usermaps) {
			// Define a sample Usermap object
			var sampleUsermap = new Usermaps({
				name: 'New Usermap'
			});

			// Set the URL parameter
			$stateParams.usermapId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/usermaps\/([0-9a-fA-F]{24})$/).respond(sampleUsermap);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.usermap).toEqualData(sampleUsermap);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Usermaps) {
			// Create a sample Usermap object
			var sampleUsermapPostData = new Usermaps({
				name: 'New Usermap'
			});

			// Create a sample Usermap response
			var sampleUsermapResponse = new Usermaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Usermap'
			});

			// Fixture mock form input values
			scope.name = 'New Usermap';

			// Set POST response
			$httpBackend.expectPOST('usermaps', sampleUsermapPostData).respond(sampleUsermapResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Usermap was created
			expect($location.path()).toBe('/usermaps/' + sampleUsermapResponse._id);
		}));

		it('$scope.update() should update a valid Usermap', inject(function(Usermaps) {
			// Define a sample Usermap put data
			var sampleUsermapPutData = new Usermaps({
				_id: '525cf20451979dea2c000001',
				name: 'New Usermap'
			});

			// Mock Usermap in scope
			scope.usermap = sampleUsermapPutData;

			// Set PUT response
			$httpBackend.expectPUT(/usermaps\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/usermaps/' + sampleUsermapPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid usermapId and remove the Usermap from the scope', inject(function(Usermaps) {
			// Create new Usermap object
			var sampleUsermap = new Usermaps({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Usermaps array and include the Usermap
			scope.usermaps = [sampleUsermap];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/usermaps\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleUsermap);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.usermaps.length).toBe(0);
		}));
	});
}());