// test for AuthSetup class

import { AuthSetup}  from '../../src/util/authSetup';

// var httpMocks = require('node-mocks-http');
// var logger = require('../../src/util/logger.js');
// var util = require('util');

describe('AuthSetup', function() {
    it("islocal for dev env", function() {
        process.env.ENVIRONMENT="dev";
        expect(AuthSetup.isLocal()).toBe(false);
    })
    it("islocal for local env", function() {
        process.env.ENVIRONMENT="local";
        expect(AuthSetup.isLocal()).toBe(true);
    })
});
