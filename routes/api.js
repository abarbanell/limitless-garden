var express = require('express');
var router = express.Router();

// 3scale API gateway
var ThreeScale = require('3scale').Client;
client = new ThreeScale(process.env.THREESCALE_PROVIDER_KEY);
var threescale = function(req, res, next) {

console.log('3scale middleware start');
	if (!req.query.user_key) {
		res.status(400).send('Bad Request - user_key missing');
	} else {
		client.authorize_with_user_key({
				"user_key": req.query.user_key
		}, function(response){
	console.log('3scale auth done');
			if (response.is_success()) {

	console.log('3scale auth success');
				var trans = [{ "user_key": req.query.user_key, 
					"usage": { "hits": 1 } 
				}];
				client.report(trans, function(response){
	console.log('3scale rep done');
					if (response.is_success()) {

	console.log('3scale rep success');
						next();
					} else {

	console.log('3scale auth fail');
						res.status(401).send('no quota: ' + response.error_message);
					};
				});
			} else {

	console.log('3scale rep fail');
				// error in authorization,
					res.status(403).send('not authorized: ' + response.error_message);
			}
		}); 
	};
};
router.use(threescale);


/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

module.exports = router;
