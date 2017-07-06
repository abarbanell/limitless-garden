// external import
import * as express from 'express';
import * as path from 'path';
import * as favicon from 'serve-favicon';
import * as morgan from 'morgan';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as session from 'express-session';

// internal imports
var logger = require('./util/logger');
// import * as logger from './util/logger';
import { statsdHits } from './util/statsd';

// TODO: import into typescript app.ts
import { AuthSetup } from './util/authSetup';

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
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(statsdHits);
app.use(cors());

AuthSetup.setAuth(app);

app.use('/', routes);
app.use('/api', api);
app.use('/auth', auth);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
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
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    title: 'Limitless Garden',
    message: err.message,
    error: {},
    user: req.user
  });
});

module.exports = app;
