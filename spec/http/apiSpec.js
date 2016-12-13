// API integration tests

// prerequisites
var supertest = require('supertest');
var status = require('http-status');
var util = require('util');
var logger = require('../../util/logger');

// environment
var port = process.env.PORT || 4321;
var user_key = process.env.THREESCALE_USER_KEY;

// system under test
var server = require('../../bin/www');

describe('collections API integration tests', function() {
  it('server should be valid', function(done){
      expect(server).toBeTruthy();
			expect(server.listen).toBeA(Function);
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

	it('GET testcollection with development user_key should return OK', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.get(url)
		.expect(status.OK, done);
	});

	it('GET testcollection with user_key should return X-Total-Count header', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.get(url).end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.headers).toBeTruthy();
			logger.info('res.headers = %s ', util.inspect(res.headers));
			expect(res.headers['x-total-count']).toBeTruthy();
			logger.info('x-total-count = %s', res.headers['x-total-count']);
			expect(res.status).toBeTruthy();
			expect(res.status).toEqual(status.OK);
			expect(res.body).toBeA(Array);
			logger.info('body has %s items', res.body.length);
			done();
		});
	});

	it('GET testcollection with user_key should return array', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.get(url).end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.status).toBeTruthy();
			expect(res.status).toEqual(status.OK);
			expect(res.body).toBeA(Array);
			logger.info('body has %s items', res.body.length);
			done();
		});
	});

	it('GET testcollection with filldate should return array with date fields', function(done) {
		var url = '/api/collections/test?filldate=1&user_key=true';
		supertest(server)
		.get(url).end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.status).toBeTruthy();
			expect(res.status).toEqual(status.OK);
			expect(res.body).toBeA(Array);
			logger.info('body has %s items', res.body.length);
			if (res.body.length == 0) {
				return done();
			};
			res.body.forEach(function(item, index, arr) {
				expect(item.date).toBeTruthy();
				if ((index+1) == arr.length) { 
					return done();
				}
			});
		});
	});

	it('GET testcollection/not-existing-id with user_key should return NOT_FOUND', function(done) {
		var url = '/api/collections/test/aabbaabbaabbccddccddccdd?user_key=true';
		supertest(server)
		.get(url)
		.expect(status.NOT_FOUND, done);
	});

	it('GET testcollection/malformed-id with user_key should return OK', function(done) {
		var url = '/api/collections/test/this-is-not-hex?user_key=true';
		supertest(server)
		.get(url)
		.expect(status.BAD_REQUEST, done);
	});

	it('GET / with user_key should return array of collections ', function(done) {
		var url = '/api/collections?user_key=true';
		supertest(server)
		.get(url)
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res.body).toBeA(Array);
			done();
		});
	});

	it('POST testcollection with GET', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.body).toBeA(Object);
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).toBeA(Array);
			expect(res.body.insertedIds.length).toEqual(1);
			var id = res.body.insertedIds[0];
			var getUrl = '/api/collections/test/' + id + '?user_key=true';
			supertest(server)
			.get(getUrl)
			.expect(status.OK, done);
		});
	});

	it('DELETE testcollection should return NOT_FOUND', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

	it('DELETE testcollection/not-existing-id should return NOT_FOUND', function(done) {
		var url = '/api/collections/test/aabbaabbaabbccddccddccdd?user_key=true';
		supertest(server)
		.delete(url)
		.expect(status.NOT_FOUND, done);
	});

	it('DELETE testcollection/malformed-id should return BAD_REQUEST', function(done) {
		var url = '/api/collections/test/this-is-not-hex?user_key=true';
		supertest(server)
		.delete(url)
		.expect(status.BAD_REQUEST, done);
	});

	it('POST testcollection with DELETE', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.body).toBeA(Object);
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).toBeA(Array);
			expect(res.body.insertedIds.length).toEqual(1);
			var id = res.body.insertedIds[0];
			var deleteUrl = '/api/collections/test/' + id + '?user_key=true';
			supertest(server)
			.delete(deleteUrl)
			.expect(status.OK, done);
		});
	});

	it('POST testcollection with POST again to same id', function(done) {
		var url = '/api/collections/test?user_key=true';
		supertest(server)
		.post(url)
		.send({field: "content"})
		.expect(status.OK)
		.end(function(err, res) {
			expect(err).not.toBeTruthy();
			expect(res).toBeTruthy();
			expect(res.body).toBeA(Object);
			logger.info('insert result=%s', util.inspect(res.body));
			expect(res.body.insertedIds).toBeA(Array);
			expect(res.body.insertedIds.length).toEqual(1);
			var id = res.body.insertedIds[0];
			var postUrl = '/api/collections/test/' + id + '?user_key=true';
			supertest(server)
			.post(postUrl)
			.expect(status.NOT_FOUND, done);
		});
	});

	 it('POST testcollection with empty payload', function(done) {
                var url = '/api/collections/test?user_key=true';
                supertest(server)
                .post(url)
				.type('json')
                .send()
                .expect(status.OK)
                .end(function(err, res) {
                        expect(err).not.toBeTruthy();
                        expect(res).toBeTruthy();
                        expect(res.body).toBeA(Object);
                        logger.info('insert result=%s', util.inspect(res.body));
						done();
                });
        });

	 it('POST testcollection with json string payload', function(done) {
                var url = '/api/collections/test?user_key=true';
                supertest(server)
                .post(url)
				.type('json')
                .send('{ "truncated": 0, "string": 1 }')
                .expect(status.OK)
                .end(function(err, res) {
                        expect(err).not.toBeTruthy();
                        expect(res).toBeTruthy();
                        expect(res.body).toBeA(Object);
                        logger.info('insert result=%s', util.inspect(res.body));
						done();
                });
        });

	 it('POST testcollection with invalid payload', function(done) {
                var url = '/api/collections/test?user_key=true';
                supertest(server)
                .post(url)
		.type('json')
                .send("{truncated: ")
                .expect(status.BAD_REQUEST)
                .end(function(err, res) {
                        expect(err).not.toBeTruthy();
                        expect(res).toBeTruthy();
                        expect(res.body).toBeA(Object);
                        logger.info('insert result=%s', util.inspect(res.body));
						done();
                });
        });

});
