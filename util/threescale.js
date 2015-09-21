// threescale middleware for general hit counter

var logger = require('./logger');

// 3scale API gateway middleware - just count hits

var ThreeScale = require('3scale').Client;
client = new ThreeScale(process.env.THREESCALE_PROVIDER_KEY);

var threescale = function(req, res, next) {
	logger.info('3scale middleware start');
  if (!req.query.user_key) {
    res.status(400).send('Bad Request - user_key missing');
  } else {
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
            res.status(401).send('no quota: ' + response.error_message);
          };
        });
      } else {

				logger.warn('3scale rep fail:' + response.error_message);
        // error in authorization,
				res.status(403).send('not authorized: ' + response.error_message);
      }
    });
  };
};

module.exports = threescale;
