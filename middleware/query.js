const qs = require('qs');
const parseUrl = require('parseurl');

module.exports = function(req, _, next) {
  if(!req.query) {
    req.query = qs.parse(parseUrl(req).query);
  }
  next();
}