var expect = require('expect.js');
var rewire = require('rewire');
var plant = rewire('../model/plant.js');
var logger = require('../util/logger');
var db = require('../util/db');
var env = process.env.ENVIRONMENT || 'dev';
var colname = env + '.plant';
var insertedIds = [];

describe('plant Model ', function() {
	beforeEach(function(done) {
		droprows(function(){
			insertrows(done);
		});
	});
	
	function insertrows(done){
		logger.info('insertrows: insert some data');
		var today = new Date();
		var objs = [{
				"name": "Hibiscus",
				"species": "Hibiscus major",
				"location": "living room",
				"sensors": [ { "type": "soil", "host": "rpi02"},
										{ "type": "temp", "host": "rpi02"},
										{ "type": "humidity", "host": "rpi02"}],
				"timestamp": Math.floor(Date.now() /1000)
			}, {
				"name": "Ficus",
				"species": "Ficus Benjamin",
				"location": "living room",
				"sensors": [ { "type": "soil", "host": "wino-18fe34f3738b"},
										{ "type": "temp", "host": "rpi02"},
										{ "type": "humidity", "host": "rpi02"}],
				"timestamp": today.toISOString()
			}, {
				"name": "Ficus 2",
				"species": "Ficus Benjamin",
				"location": "office room",
				"sensors": [],
				"timestamp": today.toISOString()
			}];
		db.connect(function(err,dbObj){
			dbObj.collection(colname).insert(objs, function(err, result) {
				if (err) {
					logger.error('insertrows Error: ' + err);
					done();
				} 
				logger.info('insertrows result: ' + JSON.stringify(result));
				insertedIds = result.insertedIds;
				dbObj.close();
				done();
			});
		});
	};
	
	after(function(done){
		droprows(done);
	});	
	
	function droprows(done) {
		db.connect(function(err,dbObj){
			dbObj.collection(colname).remove({}, function(err, result) {
				if (err) {
					logger.error('droprows() error: '+ err);
				}
				logger.info('droprows() - removed data: ' + JSON.stringify(result));
				dbObj.close();
				done();
			});
		});
	};
	
  it('should contain get and some other methods ', function(){
      expect(plant).to.be.an('object');
      expect(plant.get).to.be.an('function');
      expect(plant.getMulti).to.be.an('function');	
      expect(plant.create).to.be.an('function');	
      expect(plant.getSpecies).to.be.an('function');	
  });

	it('get a single value - notfound', function(done) {
		plant.get("notexistingid", function(err, result) { 
			// not found would return both err= null and result = null (or empty object{} )
			logger.info('get single - notfound - returns err=%s and result=%s', typeof(err), typeof(result));
			if (err) {
				logger.info('err = %s', JSON.stringify(err));
			}
			expect(err).to.not.be.ok(); 
			expect(result).to.not.be.ok();
		  done();
		});
	});
	
	it('get a single value - found', function (done) {
		plant.get(insertedIds[0], function (err, result) {
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				expect(result._id).to.eql(insertedIds[0]);
				done();
			}
		});
	});

	it('should get an array of values', function(done) {
		plant.getMulti({}, {}, function (err, result) {
			logger.info('model_plant test: getmulti callback reached');
			if (err) {
				logger.error('err = ' + JSON.stringify(err));
				done();
			} else {
				expect(err).to.not.be.ok();
				expect(result).to.be.ok();
				logger.info('getMulti result: ' + JSON.stringify(result));
				expect(result.length).to.eql(insertedIds.length);
				done();
			}
		});
	});

	it('should get distinct species', function(done) {
		plant.getSpecies(function(err,result){
			if (err) {
				logger.error('plant.js - error in getSpecies()');
				return callback(err, null);
			};
			expect(err).to.not.be.ok();
			expect(result).to.be.ok();
			expect(result).to.be.an('array');
			expect(result.length).to.eql(2);
			done();
		});
	});

	it('check private check() function', function(done) {
		var private_check = plant.__get__('check');
		expect(private_check).to.be.an('function');
		var lobj = private_check({});
		expect(lobj.name).to.eql("unknown");
		lobj = private_check({name: "n1", species: "s1", location: "l1"});
		expect(lobj.name).to.eql("n1");
		expect(lobj.species).to.eql("s1");
		expect(lobj.location).to.eql("l1");
		done();
	}); 

	it('should create a new entry', function(done) {
		var obj = {
				"name": "new Hibiscus",
				"species": "Hibiscus major",
				"location": "living room",
				"sensors": [ { "type": "soil", "host": "rpi03"},
										{ "type": "temp", "host": "rpi02"},
										{ "type": "humidity", "host": "rpi02"}],
				"timestamp": Math.floor(Date.now() /1000)
			};
		plant.create(obj, function(err, result) {
			if (err) { 
				logger.error('plan.js - create failed: ' + (err.err || "no error"));
			} 
			expect(err).to.not.be.ok();
			expect(result).to.be.ok();
			done();
		});
	});

});