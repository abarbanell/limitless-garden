// threescale middleware for general hit counter

var logger = require('./logger');
var status = require('http-status');

// 3scale API gateway middleware - just count hits

// var ThreeScale = require('3scale');
// client = new ThreeScale.Client(process.env.THREESCALE_PROVIDER_KEY);
var apikeys = JSON.parse(process.env.API_KEYS);
logger.info("apikeys: " + apikeys);

var threescale = function(req, res, next) {
  if (req.isAuthenticated()) { 
		logger.info('session cookie valid, 3scale quota bypassed');
		return next(); 
	}
	logger.info('threescale: 3scale middleware start');
  if (!req.query.user_key) {
    logger.error("400 - BAD_REQUEST - threescale: user key missing [IP: " + req.ip + "]");
    res.status(status.BAD_REQUEST).send('Bad Request - user_key missing');
  } else {
    logger.info("threescale: user key exists - " + req.query.user_key);
    if ((process.env.ENVIRONMENT === "local")) {
      // total bypass
      logger.info("threescale: local mode, no check");
      return next();
    }
		if ((req.app.get('env') === 'development') && (req.query.user_key === 'true')) {
      logger.info("threescale: development environment and dummy key, ok.");
    	return next();
		}
    if (apikeys.includes(req.query.user_key)) {
			logger.info('threescale: api key validated against env var');
      next();
    } else {
			logger.warn('threescale: user_key invalid');
      res.status(status.UNAUTHORIZED).send('invalid user_key');
    }
  }
}

module.exports = threescale;
