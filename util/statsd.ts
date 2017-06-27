var logger = require('./logger');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

var Statsd = require('node-statsd');

var client = new Statsd({
  host: process.env.STATSD_HOST,
  port: process.env.STATSD_PORT
});
var prefix = process.env.ENVIRONMENT
logger.info("StatsdUtil - initialization code");

export function statsdHits(req, res, next) {
  var c1 = prefix + ".http";
  var c2 = prefix + "." + req.method;
  var c3 = prefix + ".route" + (req.originalUrl || "/");
  client.increment(c1, 1);
  client.increment(c2, 1);
  client.increment(c3, 1);
  logger.info("StatsdUtil - statsd increment: " + c1 + ", " + c2 + ", " + c3);
  return next();
}

