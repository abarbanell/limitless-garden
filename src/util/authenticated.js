var status = require('http-status');

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.

var str = process.env.API_KEYS;
var api_keys = JSON.parse(str);

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function ensureApiKey(req, res, next) {
  if (req.query.user_key &&  
      api_keys.includes(req.query.user_key)) {
      return next(); 
  }
  res.status(status.FORBIDDEN).send(status[status.FORBIDDEN]);
}

function ensureCookieOrApikey(req, res, next) {
  if (req.isAuthenticated()) { 
    return next(); 
  }
  return ensureApiKey(req, res, next);
}

function isAdmin(req, res, next) {
  if (req.user && req.user.profile && (req.user.profile.id == process.env.GOOGLE_ID_ADMIN)) { 
    req.user.admin = true;
  }
  return next();
}

module.exports = {
	cookie: ensureAuthenticated,
	apikey: ensureApiKey,
	cookieOrApikey: ensureCookieOrApikey,
  admin: isAdmin
}


