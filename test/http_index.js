// API integration tests

// prerequisites
var expect = require('expect.js');
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
var logger = require('../util/logger');

// environment
var port = process.env.PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../bin/www');

describe('collections index.js route tests', function() {

	it('GET about page - no auth needed', function(done) {
		supertest(server)
		.get('/about')
		.expect(status.OK, done);
	});

	it('GET login page - even if no auth ', function(done) {
		supertest(server)
		.get('/login')
		.expect(status.OK, done);
	});

	it('GET logout page - successful redirect even if no auth ', function(done) {
		supertest(server)
		.get('/logout')
		.expect(status.FOUND, done);
	});

});

