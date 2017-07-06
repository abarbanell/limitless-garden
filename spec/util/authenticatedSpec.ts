// test for util/authenticated middleware

var auth = require('../../src/util/authenticated.js');

var httpMocks = require('node-mocks-http');
var logger = require('../../src/util/logger.js');
var util = require('util');

describe('Middleware test for authentication', function() {
	it('check passport authentication - happy path', function(done) {
		var request = httpMocks.createRequest({
			method: 'GET',
			url: '/test/path',
			isAuthenticated: function(){ return true;}
		});
		var response = httpMocks.createResponse();
		auth.cookie(request, response, function next(error) {
			if (error) {
				logger.error("error received");
			};
			expect(response.statusCode).toEqual(200);
			done();
		});
	});

	it('check passport authentication - not authenticated', function(done) {
		var request = httpMocks.createRequest({
			method: 'GET',
			url: '/test/path',
			isAuthenticated: function(){ return false;}
		});
		var response = httpMocks.createResponse();
		response.redirect = function(url) {
			expect(url).toEqual('/login');
			done();
		};
		auth.cookie(request, response, function next(error) {
			if (error) {
				logger.error("error received");
			};
			logger.error("you should not get here");
			expect(response.statusCode).not.toEqual(200);
			done();
		});
	});
});		
	


