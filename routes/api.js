var express = require('express');
var router = express.Router();
var logger = require('../util/logger');
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
  req.collection.removeById(req.params.id, function(e, result){
    if (e) return next(e)
    res.send((result === 1)?{msg: 'success'} : {msg: 'error'})
  })
});

module.exports = router;
