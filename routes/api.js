var express = require('express');
var router = express.Router();
var mongoskin = require('mongoskin');

var mongourl = process.env.MONGOLAB_URI || 'mongodb://localhost:27107/test';
var db = mongoskin.db(mongourl, {safe: true});

var threescale = require('../util/threescale');
router.use(threescale);

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

router.param('collectionName', function(req, res, next, collectionName){
  req.collection = db.collection(collectionName)
  return next()
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


module.exports = router;
