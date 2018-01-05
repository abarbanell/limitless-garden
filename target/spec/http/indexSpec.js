// API integration tests
// prerequisites
var supertest = require('supertest');
var httpStatus = require('http-status');
var util = require('util');
var logger = require('../../src/util/logger');
var httpMocks = require('node-mocks-http');
var rewire = require('rewire');
var sensorHelper = require('../helpers/sensor');
var authenticated = require('../../src/util/authenticated');
// environment
var port = process.env.TEST_PORT || "4321";
var str = process.env.API_KEYS;
var arr = JSON.parse(str);
var user_key = arr[0];
// system under test
var server = require('../../src/server');
var indexrouter = rewire('../../src/routes/index.js');
//var indexrouter = require('../../src/routes/index.js');
describe('index.js route anonymous', function () {
    it('GET about page - no auth needed', function (done) {
        supertest(server)
            .get('/about')
            .expect(httpStatus.OK, done);
    });
    it('GET login page - even if no auth ', function (done) {
        supertest(server)
            .get('/login')
            .expect(httpStatus.OK, done);
    });
    it('GET logout page - successful redirect even if no auth ', function (done) {
        supertest(server)
            .get('/logout')
            .expect(httpStatus.FOUND, done);
    });
});
describe('index.js routes with mocked auth', function () {
    var request, response;
    beforeEach(function (done) {
        request = httpMocks.createRequest({
            rethod: 'GET',
            url: '/api/sensor',
            isAuthenticated: function () { return true; }
        });
        response = httpMocks.createResponse();
        sensorHelper.droprows(function () {
            sensorHelper.insertrows(done);
        });
    });
    afterEach(function (done) {
        sensorHelper.droprows(done);
    });
    it('check sensorRoute - happy path', function (done) {
        // we want to catch the res.render function
        response.render = function (view, obj) {
            logger.info("mocked res.render() called as expected");
            expect(view).toBeTruthy();
            expect(obj).toBeTruthy();
            return done();
        };
        var sr = indexrouter.__get__('sensorRoute');
        sr(request, response, function next(error) {
            if (error) {
                logger.error("error received: " + error);
            }
            ;
            expect("you should not get here").toEqual("Never");
            return done();
        });
    });
    it('collectionsListRoute - happy path', function (done) {
        // we want to catch the res.render function
        response.render = function (view, obj) {
            expect(view).toEqual('index');
            expect(obj).toBeTruthy();
            done();
        };
        var sr = indexrouter.__get__('collectionsListRoute');
        sr(request, response, function next(error) {
            if (error) {
                logger.error("error received: " + error);
            }
            ;
            expect("you should not get here").toEqual("Never");
            done();
        });
    });
    it('collectionsRoute - happy path', function (done) {
        // we need to add a db collection obj to the request object
        sensorHelper.getCollection(function (collection) {
            request.collection = collection;
            // we want to catch the res.render function
            response.render = function (view, obj) {
                expect(view).toEqual('collection');
                expect(obj).toBeTruthy();
                done();
            };
            var sr = indexrouter.__get__('collectionsRoute');
            sr(request, response, function next(error) {
                if (error) {
                    logger.error("error received");
                }
                ;
                expect("you should not get here").toEqual("Never");
                done();
            });
        });
    });
    it('hostsRoute - happy path', function (done) {
        // we need to add a db collection obj to the request object
        sensorHelper.getCollection(function (collection) {
            // we want to catch the res.render function
            response.render = function (view, obj) {
                expect(view).toEqual('hosts');
                expect(obj).toBeTruthy();
                expect(typeof (obj.title)).toBe('string');
                expect(typeof (obj.data.length)).toBe('number');
                done();
            };
            var sr = indexrouter.__get__('hostsRoute');
            sr(request, response, function next(error) {
                if (error) {
                    logger.error("error received");
                }
                ;
                expect("you should not get here").toEqual("Never");
                done();
            });
        });
    });
    it('hostDataRoute - happy path single sensor', function (done) {
        // we need to add a db collection obj to the request object
        sensorHelper.getCollection(function (collection) {
            expect(request.params).toBeTruthy();
            request.params.host = "rpi02";
            // we want to catch the res.render function
            response.render = function (view, obj) {
                expect(view).toEqual('hostdata');
                expect(obj).toBeTruthy();
                expect(typeof (obj.title)).toBe('string');
                expect(typeof (obj.data.length)).toBe('number');
                expect(typeof (obj.data[0].sensor.length)).toBe('number');
                expect(obj.data[0].sensor.length).toEqual(1);
                done();
            };
            var sr = indexrouter.__get__('hostDataRoute');
            sr(request, response, function next(error) {
                if (error) {
                    logger.error("error received");
                }
                ;
                expect("you should not get here").toEqual("Never");
                done();
            });
        });
    });
    it('hostDataRoute - happy path multi sensor', function (done) {
        // we need to add a db collection obj to the request object
        sensorHelper.getCollection(function (collection) {
            expect(request.params).toBeTruthy();
            request.params.host = "rpi03";
            // we want to catch the res.render function
            response.render = function (view, obj) {
                expect(view).toEqual('hostdata');
                expect(obj).toBeTruthy();
                expect(typeof (obj.title)).toBe('string');
                expect(typeof (obj.data.length)).toBe('number');
                expect(typeof (obj.data[0].sensor.length)).toBe('number');
                expect(typeof (obj.data[0].sensor[0])).toBe('string');
                logger.info('sensor.length: ' + obj.data[0].sensor.length);
                expect(obj.data[0].sensor.length).toBeGreaterThan(1);
                done();
            };
            var sr = indexrouter.__get__('hostDataRoute');
            sr(request, response, function next(error) {
                if (error) {
                    logger.error("error received");
                }
                ;
                expect("you should not get here").toEqual("Never");
                done();
            });
        });
    });
    describe('index.js SPA', function () {
        var request, response;
        it('spa route returns http status OK', function (done) {
            request = httpMocks.createRequest({
                method: 'GET',
                url: '/spa',
                isAuthenticated: function () { return true; }
            });
            response = httpMocks.createResponse();
            response.sendFile = function (url) {
                logger.error("sendfile mock callback for url: " + url);
                expect(url).toContain('index.html');
                logger.error("sendfile mock callback: we are done() here");
                done();
            };
            var sr = indexrouter.__get__('spaRoute');
            sr(request, response);
            expect(response.statusCode).toBe(200);
        });
        it('mocked cookie authentication OK', function (done) {
            request = httpMocks.createRequest({
                method: 'GET',
                url: '/spa',
                isAuthenticated: function () { return true; }
            });
            response = httpMocks.createResponse();
            var next = function (req, res) { };
            authenticated.cookie(request, response, next);
            expect(response.statusCode).toBe(200);
            done();
        });
        it('mocked without cookie should fail authentication', function (done) {
            request = httpMocks.createRequest({
                method: 'GET',
                url: '/spa',
                isAuthenticated: function () { return false; }
            });
            response = httpMocks.createResponse();
            var next = function (req, res) { };
            authenticated.cookie(request, response, next);
            // expect redirect to login
            expect(response.statusCode).toBe(302);
            expect(response._getRedirectUrl()).toContain('login');
            done();
        });
    });
});
//# sourceMappingURL=indexSpec.js.map