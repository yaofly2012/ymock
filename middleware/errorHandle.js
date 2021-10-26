const { logger } = require('../utils/util')

module.exports = function(err, _, res, _) {  
  err.ignoreLog || logger.error(err);
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');    
  res.writeHead(500);
  res.end(err && err.message);
}