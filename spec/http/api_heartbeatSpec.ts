import * as supertest from 'supertest';
var httpStatus  = require('http-status');
var util = require('util');
import logger = require('../../src/util/logger');

// system under test
var str = process.env.API_KEYS;
var obj = JSON.parse(str);
var user_key = obj[0];
var port = process.env.TEST_PORT || "4321";
process.env.PORT = port;
import * as server from '../../src/server';
import { SensorModel } from '../../src/model/model.sensor';
import { HeartbeatPayload } from '../../src/model/model.heartbeat';


describe('heartbeat route test', function() {
	beforeEach(done => {
		var s = SensorModel.getInstance();
		s.deleteAll().subscribe(s => { 
			logger.error('beforeAll: deleted sensor row count is ', s);
			done(); 
		});
	})
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

	
	it('POST heartbeat - small payload', (done) => {
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

	it('POST heartbeat - payload with values', (done) => {
    var payload = { 
      host: "ESP_TEST",
			uptime: (new Date()).getMinutes(),
			i2cDevices: 0,
			values: [ 
				{ type: "soil", val: 17}, 
				{ type: "temperature", val: 27.3} 
			]
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

  it('GET heartbeat by ID - payload with values', (done) => {
    let payload: HeartbeatPayload = { 
      host: "ESP_TEST",
			uptime: (new Date()).getMinutes(),
			i2cDevices: 0,
			values: [ 
				{ type: "soil", val: 17}, 
				{ type: "temperature", val: 27.3} 
			]
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
			supertest(server)
				.get('/api/heartbeat/'+ res.body._id + '?user_key=' + user_key)
				.expect(httpStatus.OK)
				.end(function(err, res) {
					expect(err).toBeNull();
					expect(res).toBeTruthy();
					done();					
				})
		});
  })
})

