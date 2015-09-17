var express = require('express');
var router = express.Router();

/* GET api  */
router.get('/hello', function(req, res, next) {
  res.send('hello world!');
});

module.exports = router;
