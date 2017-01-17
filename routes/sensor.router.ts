import * as express from 'express';
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');

import { SensorModel }  from '../model/sensor.model';
import { Observable } from 'rxjs/Rx'

var threescale = require('../util/threescale');
router.use(threescale);

var sensorModel = new SensorModel();

// GET /api/sensors -> list of sensors
router.get('/', function(req, res, next) {
	sensorModel.get().subscribe(s => {		
		  res.json(s);
	}, e => {
		logger.error('sensor router get("/") error: ', e);
	});
});

// POST /api/sensors -> create new sensor 
router.post('/', function(req, res, next) {
	try {
		sensorModel.post(req.body).subscribe(s => {
			logger.error('post succceeded: ', s);
			var payload = { _id: s, rc: "OK" }
			res.json(payload);
		}, e=> {
			logger.error('post failed: ', e);
		})
	} catch (ex) {
		logger.error('sensor router post("/") exception ', ex);
	}
})


module.exports = router;



