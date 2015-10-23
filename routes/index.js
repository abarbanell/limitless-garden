var express = require('express');
var router = express.Router();
var sensor = require('../model/sensor');
var logger = require('../util/logger');

/* GET home page. */
router.get('/', function (req, res, next) {

    sensor.getMulti(null, 10, function (err, result) {
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
					var date = new Date(obj.timestamp);
					rObj.date = date.toJSON();
				}
				rObj.value = obj.soil;
				// copy some fields
				rObj.host = obj.host;
				rObj.sensor = obj.sensor;
				// ignore all other fields and return
				return rObj;
			});
			logger.info('mapped = ' + JSON.stringify(mapped));
			res.render('index', { title: 'Limitless Garden', dataTable: true, hostsTable: false, data: mapped });
		};
	});
});

/* GET hosts page. */
router.get('/login', function (req, res, next) {
			res.render('login', { 
			});
});

/* GET hosts page. */
router.get('/hosts', function (req, res, next) {

    sensor.getUniqueHosts(function (err, result) {
		if (err) {
			logger.error(err);
			res.status(500).render(error, { err: err});
		} else {
			logger.info('result = ' + JSON.stringify(result));	
			res.render('index', { 
				title: 'Limitless Garden - Hosts', 
				dataTable: false, 
				hostsTable: true, 
				data: result
			});
		}
	});
});

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

module.exports = router;
