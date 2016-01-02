// API integration tests

// prerequisites
var expect = require('expect.js');
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
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

	it('POST testcollection missing user_key should return BAD_REQUEST', function(done) {
		supertest(server)
		.post('/api/collections/test')
		.expect(status.BAD_REQUEST, done);
	});

	it('PUT testcollection missing user_key should return BAD_REQUEST', function(done) {
		supertest(server)
		.put('/api/collections/test')
		.expect(status.BAD_REQUEST, done);
	});

	it('DELETE testcollection missing user_key should return BAD_REQUEST', function(done) {
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

	it('GET testcollection with user_key should return X-Total-Count header', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.get(url).end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.headers).to.be.ok();
			logger.info('res.headers = %s ', util.inspect(res.headers));
			expect(res.headers['x-total-count']).to.be.ok();
			logger.info('x-total-count = %s', res.headers['x-total-count']);
			expect(res.status).to.be.ok();
			expect(res.status).to.eql(status.OK);
			expect(res.body).to.be.an('array');
			logger.info('body has %s items', res.body.length);
			done();
		});
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

	it('GET testcollection/not-existing-id with user_key should return NOT_FOUND', function(done) {
		var url = '/api/collections/test/aabbaabbaabbccddccddccdd?user_key=' + user_key;
		supertest(server)
		.get(url)
		.expect(status.NOT_FOUND, done);
	});

	it('GET testcollection/malformed-id with user_key should return OK', function(done) {
		var url = '/api/collections/test/this-is-not-hex?user_key=' + user_key;
		supertest(server)
		.get(url)
		.expect(status.BAD_REQUEST, done);
	});

	it('GET / with user_key should return array of collections ', function(done) {
		var url = '/api/collections?user_key=' + user_key;
		supertest(server)
		.get(url)
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res.body).to.be.an('array');
			done();
		});
	});

	it('POST testcollection with GET', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.body).to.be.an('object');
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).to.be.an('array');
			expect(res.body.insertedIds.length).to.eql(1);
			var id = res.body.insertedIds[0];
			var getUrl = '/api/collections/test/' + id + '?user_key='+ user_key;
			supertest(server)
			.get(getUrl)
			.expect(status.OK, done);
		});
	});

	it('DELETE testcollection should return NOT_FOUND', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

	it('DELETE testcollection/not-existing-id should return NOT_FOUND', function(done) {
		var url = '/api/collections/test/aabbaabbaabbccddccddccdd?user_key=' + user_key;
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

	it('DELETE testcollection/malformed-id should return BAD_REQUEST', function(done) {
		var url = '/api/collections/test/this-is-not-hex?user_key=' + user_key;
		supertest(server)
		.delete(url)
		.expect(status.BAD_REQUEST, done);
	});

	it('POST testcollection with DELETE', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.body).to.be.an('object');
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).to.be.an('array');
			expect(res.body.insertedIds.length).to.eql(1);
			var id = res.body.insertedIds[0];
			var deleteUrl = '/api/collections/test/' + id + '?user_key='+ user_key;
			supertest(server)
			.delete(deleteUrl)
			.expect(status.OK, done);
		});
	});

	it('POST testcollection with POST again to same id', function(done) {
		var url = '/api/collections/test?user_key=' + user_key;
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).to.not.be.ok();
			expect(res).to.be.ok();
			expect(res.body).to.be.an('object');
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).to.be.an('array');
			expect(res.body.insertedIds.length).to.eql(1);
			var id = res.body.insertedIds[0];
			var postUrl = '/api/collections/test/' + id + '?user_key='+ user_key;
			supertest(server)
			.post(postUrl)
			.expect(status.NOT_FOUND, done);
		});
	});
});

