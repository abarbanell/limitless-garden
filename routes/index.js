var express = require('express');
var router = express.Router();
var sensor = require('../model/sensor');
var logger = require('../util/logger');

/* GET home page. */
router.get('/', function(req, res, next) {
	res.render('index', { title: 'Limitless Garden'});
//	sensor.getMulti(0, 10, function(err, result) { 
//		logger.info('sensor.getMulti called: err=' + err);
//		if (err) { 
//			res.status(500).render(error, { err: err });
//		} else { 		
//  		res.render('index', { title: 'Limitless Garden', data: result });
//		};
//	});
});

module.exports = router;
