import * as express from 'express';
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');

import { Heartbeat }  from '../model/hb.model';
import { Observable } from 'rxjs/Rx'

var authenticated = require('../util/authenticated');
router.use(authenticated.cookieOrApikey);

// POST /api/heartbeat -> log one entry
router.post('/', function(req, res, next) {
	try {
		var hb = new Heartbeat();
		hb.populate(req.body);
		hb.post().subscribe(s => {
			var str: string = s;
			var payload = { _id: str, rc: "OK" }
			res.json(payload);
		}, e=> {
			logger.error('post failed: ', e);
		})
	} catch (ex) {
		logger.error('heartbeat router post("/") exception ', ex);
	}
})

module.exports = router;



