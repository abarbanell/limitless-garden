import * as supertest from 'supertest';
var httpStatus  = require('http-status');
var util = require('util');
import logger = require('../../src/util/logger');

// system under test
var user_key = process.env.THREESCALE_USER_KEY;
var port = process.env.TEST_PORT || "4321";
process.env.PORT = port;
import * as server from '../../src/server';


describe('heartbeat route test', function() {
	it('server should be valid', function(done){
		expect(server).toBeTruthy();
		expect(server.listen).toBeDefined();
		done();
	});

	it('port should be set', function(done) {
		expect(port).toBeTruthy();
		logger.info('port=%s', port);
		done();
	});

	it('user_key should be set', function(done) {
		expect(user_key).toBeTruthy();
		logger.info('user_key=%s', user_key);
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
			logger.info("err: " + util.inspect(err));
			expect(err).toBeNull();
			expect(res).toBeTruthy();
			expect(res.body).toBeDefined()
			logger.info('res.body: ' +  util.inspect(res.body));
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBe("OK");
			done();
		});
  })
})

