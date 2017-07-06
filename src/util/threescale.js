// threescale middleware for general hit counter

var logger = require('./logger');
var status = require('http-status');

// 3scale API gateway middleware - just count hits

var ThreeScale = require('3scale');
client = new ThreeScale.Client(process.env.THREESCALE_PROVIDER_KEY);

var threescale = function(req, res, next) {
  if (req.isAuthenticated()) { 
		logger.info('session cookie valid, 3scale quota bypassed');
		return next(); 
	}
	logger.info('threescale: 3scale middleware start');
  if (!req.query.user_key) {
    logger.info("threescale: user key missing");
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
    client.authorize_with_user_key({
        "user_key": req.query.user_key
    }, function(response){
			logger.info('threescale: real 3scale auth done');
      if (response.is_success()) {

				logger.info('threescale: 3scale auth success');
        var trans = [{ "user_key": req.query.user_key,
          "usage": { "hits": 1 }
        }];
        client.report(trans, function(response){
					logger.info('threescale: 3scale rep done');
          if (response.is_success()) {

						logger.info('threescale: 3scale rep success');
            next();
          } else {

						logger.warn('threescale: 3scale auth fail: ' + response.error_message);
            res.status(status.UNAUTHORIZED).send('no quota: ' + response.error_message);
          };
        });
      } else {

				logger.warn('threescale: 3scale rep fail:' + response.error_message);
        // error in authorization,
				res.status(status.FORBIDDEN).send('not authorized: ' + response.error_message);
      }
    });
  };
};

module.exports = threescale;
