"use strict";
// external import
var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var morgan = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var cors = require("cors");
var session = require("express-session");
// internal imports
var logger = require('./util/logger');
// import * as logger from './util/logger';
var statsd_1 = require("./util/statsd");
// TODO: import into typescript app.ts
var authSetup_1 = require("./util/authSetup");
var routes = require('./routes/index');
var api = require('./routes/api');
var auth = require('./routes/auth');
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, '../public', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(require('less-middleware')(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../public')));
app.use(statsd_1.statsdHits);
app.use(cors());
authSetup_1.AuthSetup.setAuth(app);
app.use('/', routes);
app.use('/api', api);
app.use('/auth', auth);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        logger.error("ERROR " + (err.status || 500) +
            " from URL: " + req.originalUrl + " [IP: " + req.ip + "] - " + err.message);
        res.status(err.status || 500);
        res.render('error', {
            title: 'Limitless Garden',
            message: err.message,
            error: err,
            user: req.user
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    logger.error("ERROR " + (err.status || 500) +
        " from URL: " + req.originalUrl + " [IP: " + req.ip + "] - " + err.message);
    res.status(err.status || 500);
    res.render('error', {
        title: 'Limitless Garden',
        message: err.message,
        error: {},
        user: req.user
    });
});
module.exports = app;
