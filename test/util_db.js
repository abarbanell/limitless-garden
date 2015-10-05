// test util/db.js
// also check some basic mongo / mongoskin fucntionality to make sure we have connectivity

var expect = require('expect.js');
var rewire = require('rewire'); 
var mongo_url = process.env.TEST_MONGO_URL; 

describe('util/db tests', function() {
	
	it('test mongo url defined?', function(done) {
		expect(mongo_url).to.contain('mongodb');
		done();
	});

  it('open DB from mongoskin directly?', function(done){
		var mongo = rewire('mongoskin');
		var db = mongo.db(mongo_url);
		check_db(db, done);
	});

	var check_db = function(db, done) {
		// console.log(db);
		expect(db).to.be.an('object');
		expect(db.bind).to.be.an('function');
		db.bind('testcollection');
		expect(db.testcollection).to.be.an('object');
		expect(db.testcollection.find).to.be.an('function');
		db.testcollection.find().toArray(function(err, items) {
			if (err) console.log('err: ' + err);
			expect(err).to.not.be.ok();
			expect(items).to.be.an('array');
			done();
		});
	};

	it('open DB via MONGOLAB_URI in util/db.js?', function(done) {
		process.env.MONGOLAB_URI = mongo_url;
		var db = rewire('../util/db');
		check_db(db, done);
	});  

});