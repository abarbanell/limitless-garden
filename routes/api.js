var express = require('express');
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var status = require('http-status');
var db = require('../util/db');
var ObjectID = require('mongodb').ObjectID;

var sensor = require('../model/sensor.js');

var threescale = require('../util/threescale');
router.use(threescale);

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

router.param('collectionName', function(req, res, next, collectionName){
	db.connect(function(err, dbObj) {
		req.collection = dbObj.collection(db.collectionName(collectionName));
		return next()
	});
});

router.get('/', function(req, res, next) {
  res.json({ msg: 'please select a collection, e.g., /collections/messages'});
});

router.get('/collections', function(req, res, next) {
	// return array of valid collection names 
	db.collections(function(err, names) {
		res.send(names);
  })
})

router.get('/collections/:collectionName', function(req, res, next) {
	req.collection.count(function(err, count) {
		if (err) { 
			logger.error('get error: %s', util.inspect(err));
			return next(err);
		}
		var limit = req.query.limit || 10;
		var offset = req.query.offset || 0;
		var fillDate = req.query.filldate || 0;
		req.collection.find({} ,{limit: limit, offset: offset, sort: {'_id': 1}}).toArray(function(e, results){
			if (e) return next(e)
			fillResults(req, res, fillDate, count, results);
		});
	});
})

var fillResults = function(req, res, fill, count, results) {
	if (fill) {
		for (var i = 0; i< results.length; i++) {
			if (! results[i].hasOwnProperty("date")) {
				results[i].date = ObjectID(results[i]._id).getTimestamp();
			}	
		}
	};
	res.set('X-Total-Count', count).send(results);
}

router.post('/collections/:collectionName', function(req, res, next) {
	logger.info('POST: ' + util.inspect(req.body));
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
		logger.info('POST result is %s', util.inspect(results));
    res.send(results)
  })
})

router.get('/collections/:collectionName/:id', function(req, res, next) {
	if (!ObjectID.isValid(req.params.id)) {
		return res.sendStatus(status.BAD_REQUEST);
	}
	var oid = ObjectID.createFromHexString(req.params.id);
  req.collection.findOne( { _id: oid } ,{}, function(e, results){
    if (e) return next(e)
		if (results) {
			return res.send(results)
		} else { 
			return res.sendStatus(status.NOT_FOUND);
		}
  })
})

router.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

router.delete('/collections/:collectionName/:id', function(req, res, next) {
	if (!ObjectID.isValid(req.params.id)) {
		return res.sendStatus(status.BAD_REQUEST);
	}
	var oid = ObjectID.createFromHexString(req.params.id);
	db.connect(function(err, dbObj) {
		req.collection.deleteOne({_id: oid}, function(e, r) {
			if (e) return next(e);
			if (r.deletedCount === 0) { 
				return res.sendStatus(status.NOT_FOUND);
			} else { 
				return res.status(status.OK).json(r.result);
			};
		});			
	});
});

// routes based on model, no direct DB queries

router.get('/sensor/:host/:value', function(req, res, next) {
	logger.info('routes/api.js - value: ' + req.params.value);
	sensor.getValuesByHost(req.params.host, req.params.value, function(err, docs) {
		if (err) { 
			logger.error('routes/api.js - error: ' + err);
		}
		var mapped = docs.map(function(item) {
			var rObj = {};
			rObj[req.params.value] = item[req.params.value];
			rObj.host = item.host;
			if (! item.hasOwnProperty("date")) {
				rObj.date = ObjectID(item._id).getTimestamp();
			}	else { 
				rObj.date = item.date;
			}
			return rObj;
		});
		logger.info('routes/api.js - mapped document length: ' + mapped.length);
		var offset = req.query.offset || 0;
		var limit = req.query.limit || (mapped.length - offset);
		res.send(mapped.slice(offset, offset+limit));
	});
});


module.exports = router;
