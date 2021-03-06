var express = require('express');
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var httpStatus = require('http-status');
var db = require('../util/db');
var ObjectID = require('mongodb').ObjectID;


import * as sensorRouter from './sensor.router' 
import * as heartbeatRouter from './heartbeat.router';
import { statsdData } from '../util/statsd';

var authenticated = require('../util/authenticated');
router.use(authenticated.cookieOrApikey);
router.use('/sensors', sensorRouter);
router.use('/heartbeat', heartbeatRouter);

router.param('collectionName', function(req, res, next, collectionName){
	db.connect(function(err, dbObj) {
		req.collection = dbObj.collection(db.collectionName(collectionName));
		return next()
	});
});

router.get('/', function(req, res, next) {
  res.json({ msg: 'please select a collection, e.g., /collections/messages'});
});

let meRoute = function(req, res, next) {
	res.json({ rc: "OK", user: req.user });
}
router.get("/me", meRoute)

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
		const limit = Number(req.query.limit) || 10;
		const offset = Number(req.query.offset) || 0;
		const fillDate = req.query.filldate || 0;
		delete req.query.filldate;
		delete req.query.limit;
		delete req.query.offset;
		const queryObj = QueryMapper.qmap(req.query);
		const opts = {limit: limit, skip: offset, sort: {'_id': 1}};
		logger.info("find options: " + util.inspect(opts));
		req.collection
		.find(queryObj ,opts)
		.toArray(function(e, results){
			if (e) return next(e)
			logger.info("fillDate=" + fillDate + ", results = " + util.inspect(results));
			fillResults(req, res, fillDate, count, results);
		});
	});
})

var fillResults = function(req, res, fill, count, results) {
	if (fill) {
		for (let i = 0; i< results.length; i++) {
			if (! results[i].hasOwnProperty("date")) {
				results[i].date = ObjectID(results[i]._id).getTimestamp();
			}	
		}
	};
	res.set('X-Total-Count', count).send(results);
}

router.post('/collections/:collectionName', statsdData, function(req, res, next) {
	logger.info('POST: ' + util.inspect(req.body));
  req.collection.insert(req.body, {}, function(e, results){
    if (e) {
			logger.error("api.post(): error from [IP: " + req.ip + "] - " + e);
			return next(e)
		}
		if (results && results.result) {
		logger.info('POST result is %s', util.inspect(results));
    res.send(results) 
		} else {
			logger.error("api.post(): nothing posted [IP: " + req.ip + "]" );
			res.status(httpStatus.BAD_REQUEST).send("nothing posted");
		}
  })
})

router.get('/collections/:collectionName/:id', function(req, res, next) {
	if (!ObjectID.isValid(req.params.id)) {
		// logger.error("400 - BAD_REQUEST - api.get(): invalid ObjectID [IP: " + req.ip + "]");
		// return res.sendStatus(httpStatus.BAD_REQUEST);
		var err: any = new Error('ObjectID not valid');
		err.status = httpStatus.BAD_REQUEST;
		return next(err);
	}
	var oid = ObjectID.createFromHexString(req.params.id);
  req.collection.findOne( { _id: oid } ,{}, function(e, results){
    if (e) return next(e)
		if (results) {
			return res.send(results)
		} else { 
			return res.sendStatus(httpStatus.NOT_FOUND);
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
		var err: any = new Error('ObjectID not valid');
		err.status = httpStatus.BAD_REQUEST;
		return next(err);
	}
	var oid = ObjectID.createFromHexString(req.params.id);
	db.connect(function(err, dbObj) {
		req.collection.deleteOne({_id: oid}, function(e, r) {
			if (e) return next(e);
			if (r.deletedCount === 0) { 
				return res.sendStatus(httpStatus.NOT_FOUND);
			} else { 
				return res.status(httpStatus.OK).json(r.result);
			};
		});			
	});
});

class QueryMapper {
	static qmap(q: Object) {
		var rc = {};
		logger.info('QueryMapper in, querystring: ' + JSON.stringify(q));
		// map fields and filter out special fields like limit, offset,...
		for (var member in q) {
			switch (member) { 
				case 'limit': 
				case 'offset':
				case 'fillDate': 
				case 'user_key':  
					break;
				default:	
					rc[member] = q[member];
			}
		}
		// return results
		logger.info('QueryMapper out, query object: ' + JSON.stringify(rc));
		return rc;
	}
}


module.exports = router;
