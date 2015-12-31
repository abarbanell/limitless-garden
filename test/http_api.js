// API integration tests

// prerequisites
var expect = require('expect.js');
var supertest = require('supertest');
var status = require('http-status');
var logger = require('../util/logger');

// environment
var port = process.env.PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../bin/www');

describe('API integration tests', function() {
  it('server should be valid', function(done){
      expect(server).to.be.ok();
			expect(server.listen).to.be.an('function');
			done();
  });
	
	it('port should be set', function(done) {
		expect(port).to.be.ok();
		logger.info('port=%s', port);
		done();
	});

	it('user_key should be set', function(done) {
		expect(user_key).to.be.ok();
		logger.info('user_key=%s', user_key);
		done();
	});

	it('GET testcollection missing user_key should return BAD_REQUEST', function(done) {
		supertest(server)
		.get('/api/collections/test')
		.expect(status.BAD_REQUEST, done);
	});

	it('GET testcollection with user_key should return OK', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.get(url)
		.expect(status.OK, done);
	});

	it('GET testcollection with user_key should return array', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.get(url).end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.status).to.be.ok();
			expect(res.status).to.eql(status.OK);
			expect(res.body).to.be.an('array');
			logger.info('body has %s items', res.body.length);
			done();
		});
	});

	it('DELETE testcollection should return NOT_FOUND', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

	it('DELETE testcollection/not-existing-id should return NOT_FOUND', function(done) {
		var url = '/api/collections/test/no-id?user_key=' + user_key;
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

});

