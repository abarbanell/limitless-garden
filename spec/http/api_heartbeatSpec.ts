import * as supertest from 'supertest';
var httpStatus  = require('http-status');
var util = require('util');
import logger = require('../../src/util/logger');

// system under test
import * as server from '../../src/server';
var user_key = process.env.THREESCALE_USER_KEY;


describe('heartbeat route test', function() {
	it('server should be valid', function(done){
		expect(server).toBeTruthy();
		expect(server.listen).toBeDefined();
		done();
	});

  it('POST heartbeat', (done) => {
    var payload = { 
      host: "ESP_TEST",
      uptime: (new Date()).getMinutes()
    }
    supertest(server)
		.post('/api/heartbeat?user_key=' + user_key)
		.send(payload)
		.expect(httpStatus.OK)
		.end(function(err, res) {
			expect(err).toBeNull();
			expect(res).toBeTruthy();
			logger.error("res: " +  util.inspect(res));
			expect(res.body).toBeDefined()
			logger.error('res.body: ' +  util.inspect(res.body));
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBe("OK");
			done();
		});
  })
})

