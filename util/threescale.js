// threescale middleware for general hit counter

var logger = require('./logger');
var status = require('http-status');

// 3scale API gateway middleware - just count hits

var ThreeScale = require('3scale').Client;
client = new ThreeScale(process.env.THREESCALE_PROVIDER_KEY);

var threescale = function(req, res, next) {
  if (req.isAuthenticated()) { 
		logger.info('session cookie valid, 3scale quota bypassed');
		return next(); 
	}
	logger.info('3scale middleware start');
  if (!req.query.user_key) {
    res.status(status.BAD_REQUEST).send('Bad Request - user_key missing');
  } else {
		if ((req.app.get('env') === 'development') && (req.query.user_key === 'true')) {
			return next();
		}
    client.authorize_with_user_key({
        "user_key": req.query.user_key
    }, function(response){
			logger.info('3scale auth done');
      if (response.is_success()) {

				logger.info('3scale auth success');
        var trans = [{ "user_key": req.query.user_key,
          "usage": { "hits": 1 }
        }];
        client.report(trans, function(response){
					logger.info('3scale rep done');
          if (response.is_success()) {

						logger.info('3scale rep success');
            next();
          } else {

						logger.warn('3scale auth fail: ' + response.error_message);
            res.status(status.UNAUTHORIZED).send('no quota: ' + response.error_message);
          };
        });
      } else {

				logger.warn('3scale rep fail:' + response.error_message);
        // error in authorization,
				res.status(status.FORBIDDEN).send('not authorized: ' + response.error_message);
      }
    });
  };
};

module.exports = threescale;
