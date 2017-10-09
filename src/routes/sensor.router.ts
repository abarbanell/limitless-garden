import * as express from 'express';
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');

import { SensorModel }  from '../model/model.sensor';
import { Observable } from 'rxjs/Rx'

var authenticated = require('../util/authenticated');
router.use(authenticated.cookieOrApikey);

var sensorModel = new SensorModel();

// GET /api/sensors -> list of sensors
router.get('/', function(req, res, next) {
	logger.info("sensor.route: GET /api/sensors");
	sensorModel.get().subscribe(s => {		
		  res.json(s);
	}, e => {
		logger.error('sensor router get("/") error: ', e);
	});
});

// GET /api/sensors/:sensorid -> details about one sensor (host, name, type,...)
router.get('/:id', function(req, res, next) {
	sensorModel.getById(req.params.id).subscribe(s => {		
		  res.json(s);
	}, e => {
		logger.error('sensor router get("/:id") error: ', e);
	});
});

// POST /api/sensors -> create new sensor 
router.post('/', function(req, res, next) {
	try {
		sensorModel.post(req.body).subscribe(s => {
			var str: string = s;
			var payload = { _id: str, rc: "OK" }
			res.json(payload);
		}, e=> {
			logger.error('post failed: ', e);
		})
	} catch (ex) {
		logger.error('sensor router post("/") exception ', ex);
	}
})

// DELETE /api/sensor/:sensorid/data 
router.delete('/:id', function(req, res, next) {
	try {
		sensorModel.delete(req.params.id).subscribe(s => {
			var payload = { deletedCount: s, rc: "OK" }
			res.json(payload);
		}, e=> {
			logger.error('delete failed: ', e);
		})
	} catch (ex) {
		logger.error('sensor router delete("/:id") exception ', ex);
	}
})

module.exports = router;



