// API integration tests
// prerequisites
var supertest = require('supertest');
var httpStatus = require('http-status');
var util = require('util');
var logger = require('../../src/util/logger');
var httpMocks = require('node-mocks-http');
var rewire = require('rewire');
var sensorHelper = require('../helpers/sensor');
// environment
var port = process.env.TEST_PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;
// system under test
var server = require('../../src/server');
var indexrouter = rewire('../../src/routes/index.js');
//var indexrouter = require('../../src/routes/index.js');
describe('collections index.js route supertests', function () {
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
describe('Middleware test for for index routes', function () {
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
});
