var express = require('express');
var router = express.Router();

var threescale = require('../util/threescale');
router.use(threescale);

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.json({msg: 'hello world!'});
});

module.exports = router;
