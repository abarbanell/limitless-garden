var express = require('express');
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var env = process.env.ENVIRONMENT || 'dev';
var db = require('../util/db');

var threescale = require('../util/threescale');
router.use(threescale);

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

router.param('collectionName', function(req, res, next, collectionName){
	db(function(err, dbObj) {
		req.collection = dbObj.collection(env + '.'+  collectionName)
		return next()
	});
});

router.get('/', function(req, res, next) {
  res.json({ msg: 'please select a collection, e.g., /collections/messages'});
});

router.get('/collections/:collectionName', function(req, res, next) {
  req.collection.find({} ,{limit: 10, sort: {'_id': -1}}).toArray(function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

router.post('/collections/:collectionName', function(req, res, next) {
	logger.info('POST: ' + JSON.stringify(req.body));
  req.collection.insert(req.body, {}, function(e, results){
    if (e) return next(e)
    res.send(results)
  })
})

router.get('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.findById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send(result)
  })
})

router.put('/collections/:collectionName/:id', function(req, res, next) {
  req.collection.updateById(req.params.id, {$set: req.body}, {safe: true, multi: false}, function(e, result){
    if (e) return next(e)
    res.send((result === 1) ? {msg:'success'} : {msg: 'error'})
  })
})

router.delete('/collections/:collectionName/:id', function(req, res, next) {
	logger.info('routes/api.js: somehow we get a 500 internal server error here..., DELETE route called');
	logger.info('routes/api.js: id=%s', req.params.id);
	db(function(err, dbObj) {
		req.collection.deleteOne({_id: req.params.id}, function(e, r) {
			logger.info('delete returned error=%s', util.inspect(e));
			if (e) return next(e);
			logger.info('delete returned result=%s', util.inspect(r.result));
			if (r.deletedCount === 0) { 
				res.sendStatus(404);
			} else { 
				res.json(200, r.result);
			};
		});			
	});
});

module.exports = router;
