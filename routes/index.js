var express = require('express');
var router = express.Router();
var db = require('../util/db');
var sensor = require('../model/sensor');
var logger = require('../util/logger');
var util = require('util');
var authenticated = require('../util/authenticated');

var sensorRoute = function (req, res, next) {
    sensor.getMulti({}, {limit: 10} , function (err, result) {
		logger.info('sensor.getMulti returned: err=' + err);
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err });
		} else {
			logger.info('result = ' + JSON.stringify(result));
			var mapped = result.map(function(obj) {
				var rObj = {};
				//rename some fields
				logger.info('typeof(timestamp) = ' + typeof(obj.timestamp));
				logger.info('typeof(timespamp) = ' + typeof(obj.timespamp));
				if(obj.timestamp) {
					if (typeof(obj.timestamp) == 'number') { // UNIX timestamp
						var date = new Date(obj.timestamp * 1000)
						rObj.date = date.toJSON();
					} else { 
						var date = new Date(obj.timestamp);
						rObj.date = date.toJSON();
					}
				}
				rObj.value = obj.soil;
				// copy some fields
				rObj.host = obj.host;
				rObj.sensor = obj.sensor;
				// ignore all other fields and return
				return rObj;
			});
			logger.info('mapped = ' + JSON.stringify(mapped));
			res.render('sensor', { 
				title: 'Limitless Garden', 
				dataTable: true, 
				hostsTable: false, 
				collectionsTable: false,
				data: mapped, 
				user: req.user 
			});
		};
	});
};

var collectionsListRoute = function (req, res, next) {
	db.collections(function(err, names) {
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err});
		} else {
			res.render('index', { 
				title: 'Limitless Garden - Collections list', 
				data: names,
				user: req.user,
				count: names.length
			});
		}
	});
};

var collectionsRoute = function (req, res, next) {
	req.collection.count(function(err, count) {
		if (err) {
			logger.error('error in collectionRoute() - count; %s', util.inspect(err));
			res.status(500).render(error, { err: err});
		} else {
			req.collection.find({}, { limit: 10 }, function(err, result) {
				if (err) {
					logger.error('error in collectionRoute(); %s', util.inspect(err));
					res.status(500).render(error, { err: err});
				} else {
					result.toArray(function(err, arr) {
						var mapped = arr.map(function(obj) {
							return util.inspect(obj);
						});
						res.render('collection', { 
							title: 'Limitless Garden - Collection: ' + req.params.collectionName, 
							data: mapped,
							count: count,
							user: req.user
						});
					});
				}
			});
		}
	});
};

var hostsRoute = function (req, res, next) {
	sensor.getUniqueHosts(function (err, result) {
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err});
		} else {
			logger.info('result = ' + JSON.stringify(result));	
			res.render('sensor', { 
				title: 'Limitless Garden - Hosts', 
				dataTable: false, 
				hostsTable: true, 
				collectionsTable: false,
				data: result,
				user: req.user
			});
		}
	});
};


router.param('collectionName', function(req, res, next, collectionName){
	db.connect(function(err, dbObj) {
		req.collection = dbObj.collection(db.collectionName(collectionName));
		return next()
	});
});

/* GET home page. */
router.get('/', authenticated, collectionsListRoute);
router.get('/collections/:collectionName', authenticated, collectionsRoute);

/* GET sensor page. */
router.get('/sensor', authenticated, sensorRoute);

/* temprarily park some routes which will be filled later */ 
router.get('/sensor/:host', authenticated, sensorRoute);
router.get('/hosts', authenticated, sensorRoute);

/* GET login page. */
router.get('/login', function (req, res, next) {
			res.render('login',  { 
				title: 'Limitless Garden',
				user: req.user
			});
});

/* GET about page. */
router.get('/about',  function (req, res, next) {
			res.render('about', { 
				 title: 'Limitless Garden',
				 user: req.user
			});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
