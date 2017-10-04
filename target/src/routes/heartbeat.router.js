"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var router = express.Router();
var logger = require('../util/logger');
var util = require('util');
var model_heartbeat_1 = require("../model/model.heartbeat");
var authenticated = require('../util/authenticated');
router.use(authenticated.cookieOrApikey);
// POST /api/heartbeat -> log one entry
router.post('/', function (req, res, next) {
    try {
        var hb = new model_heartbeat_1.Heartbeat();
        hb.populate(req.body);
        hb.post().subscribe(function (s) {
            var str = s;
            var payload = { _id: str, rc: "OK" };
            res.json(payload);
        }, function (e) {
            logger.error('post failed: ', e);
        });
    }
    catch (ex) {
        logger.error('heartbeat router post("/") exception ', ex);
    }
});
router.get('/:id', function (req, res, next) {
    try {
        model_heartbeat_1.Heartbeat.getByID(req.params.id).subscribe(function (hb) {
            res.json(hb);
        }, function (e) {
            logger.error('getById failed: ', e);
        });
    }
    catch (ex) {
        logger.error('heartbeat router getById("/") exception ', ex);
    }
});
module.exports = router;
