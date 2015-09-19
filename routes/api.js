var express = require('express');
var router = express.Router();

// 3scale API gateway
var ThreeScale = require('3scale').Client;
client = new ThreeScale(process.env.THREESCALE_PROVIDER_KEY);
var threescale = function(req, res, next) {
  client.authrep_with_user_key({
			"user_key": req.query.user_key,
      "usage": { "hits": 1 } 
  }, function(response){
    if (response.is_success()) {
			next();
		} else {
			res.status(403).send('not authorized: ' + response.error_message);
		}
  }); 
};
router.use(threescale);


/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

module.exports = router;
