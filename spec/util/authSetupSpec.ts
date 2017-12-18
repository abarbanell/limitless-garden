// test for AuthSetup class

import { AuthSetup}  from '../../src/util/authSetup';

import logger = require('../../src/util/logger');

// system under test
import server = require('../../src/server');

// var httpMocks = require('node-mocks-http');
// var util = require('util');

describe('AuthSetup', function() {
    it("isLocal for dev env", function() {
        process.env.ENVIRONMENT="dev";
        expect(AuthSetup.isLocal()).toBe(false);
    })
    it("isLocal for local env", function() {
        process.env.ENVIRONMENT="local";
        expect(AuthSetup.isLocal()).toBe(true);
    })
    it("AuthSetup.setAuth(null) does not throw", function() {
        expect(function() {
            AuthSetup.setAuth(null)
        }).not.toThrow();
    })
    it("AuthSetup(app) does not throw", function() {
        expect(function() {
            AuthSetup.setAuth(server);
        }).not.toThrow()
    })

});
