import { EventEmitter } from "@angular/core";

// API integration tests

// prerequisites
var supertest = require('supertest');
var httpStatus = require('http-status');
var httpMocks = require('node-mocks-http');
var rewire = require('rewire');
var util = require('util');

var logger = require('../../src/util/logger');
var authenticated = require('../../src/util/authenticated');

// environment
var port = process.env.TEST_PORT || "4321";
process.env.PORT=port;
var str = process.env.API_KEYS;
var arr = JSON.parse(str);
var user_key = arr[0];


describe("/me endpoint", function () {
	// system under test
	let server = require('../../src/server');
	let apiRouter = rewire("../../src/routes/api");

	it("get /me should return FORBIDDEN if not logged in", function (done) {
		let url = "/api/me";
		supertest(server)
			.get(url)
			.expect(httpStatus.FORBIDDEN)
			.end(function (err, res) {
				expect(err).toBeNull();
				expect(res).toBeTruthy();
				expect(res.body).toBeDefined();
				return done();
			});
	})

	it("get /me should return OK if logged in with api key", function (done) {
		let url = "/api/me?user_key=true";
		supertest(server)
			.get(url)
			.expect(httpStatus.OK)
			.end(function (err, res) {
				expect(err).toBeNull();
				expect(res).toBeDefined();
				expect(res.status).toBe(httpStatus.OK);
				expect(res.body.rc).toBe("OK")
				return done();
			});
	})

	it('route function ok', function (done) {
		let request = httpMocks.createRequest({
			method: 'GET',
			url: '/api/me',
			isAuthenticated: function () { return true; },
			user: { profile: { displayName: "Unit Test User" }}
		});
		expect(request).toBeDefined();

		let response = httpMocks.createResponse();

		// response is an EventEmitter, so I need to emit this first before 
		// I can see the json function. Don't do this:	
		// expect(response.json).toBeDefined();
		expect(util.inspect(response)).toContain('EventEmitter');
	
		let next = apiRouter.__get__('meRoute');
		expect(next).toBeDefined();
		expect(typeof(next)).toBe('function');

		// it fails inside this call because the resolving of next requires 
		// a req.user object: 
		let lrc = next(request, response);

		expect(lrc).toBeUndefined();
		expect(response.statusCode).toBe(httpStatus.OK);
		done();
	});

	it('mocked without cookie should fail authentication', function (done) {
		let request = httpMocks.createRequest({
			method: 'GET',
			url: '/api/me',
			isAuthenticated: function () { return false; }
		});
		let response = httpMocks.createResponse();

		let next = apiRouter.__get__('meRoute');
		authenticated.cookie(request, response, next);

		// expect redirect to login
		expect(response.statusCode).toBe(302);
		done();
	});
})
		





