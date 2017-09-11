// threescale middleware for general hit counter
var logger = require('./logger');
var status = require('http-status');
var apikeys = JSON.parse(process.env.API_KEYS);
// var threescale = function(req, res, next) {
//   if (req.isAuthenticated()) { 
// 		logger.info('session cookie valid, 3scale quota bypassed');
// 		return next(); 
// 	}
//   if (!req.query.user_key) {
//     logger.error("400 - BAD_REQUEST: user key missing [IP: " + req.ip + "]");
//     res.status(status.BAD_REQUEST).send('Bad Request - user_key missing');
//   } else {
//     if (apikeys.includes(req.query.user_key)) {
// 			logger.info('threescale: api key validated against env var');
//       next();
//     } else {
// 			logger.warn('threescale: user_key invalid');
//       res.status(status.UNAUTHORIZED).send('403 - NOT AUTHORIZED: invalid user_key');
//     }
//   }
// }
// module.exports = threescale;
