var logger = function() {

    // this is very short but we do not want the application to know how we do logging. 
    // maybe we want to have a more complex logging later
    
  var winston = require('winston');
  winston.level = process.env.LOG_LEVEL || 'error';
  return winston;
}();

module.exports = logger;
