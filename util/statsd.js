var status = require('http-status');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

var Client = require('node-statsd-client').Client;

var client = new Client(process.env.STATSD_HOST, process.env.STATSD_PORT);
var prefix = process.env.ENVIRONMENT

function statsdHits(req, res, next) {
  // client.increment(prefix)
  next();
}


module.exports = {
	statsdHits: statsdHits
}