import * as supertest from 'supertest';
var httpStatus  = require('http-status');

// system under test
import * as server from '../../src/server';
import logger = require('../../src/util/logger');

describe('heartbeat route test', function() {
  it('POST heartbeat', (done) => {
    var payload = { 
      host: "ESP_TEST",
      uptime: (new Date()).getMinutes()
    }
    supertest(server)
		.post('/api/heartbeat?user_key=true')
		.send(payload)
		.expect(httpStatus.OK)
		.end(function(err, res) {
			expect(err).toBeNull();
			expect(res).toBeDefined();
			expect(res.body).toBeDefined()
			logger.info('res.body: ', res.body);
			expect(res.body._id).toBeDefined();
			expect(res.body.rc).toBe("OK");
			done();
		});
  })
})

