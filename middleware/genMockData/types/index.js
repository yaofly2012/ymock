const { isFunction } = require('../../../utils/util');
const execMockFunc = require('./function');

// Get mock data
module.exports = function genMockData(req, res, next) {
  const matchedRule = req.matchedRule;
  // 如果respondWith不是函数，则转成函数处理方式
  const respondWith = isFunction(matchedRule.respondWith)
    ? matchedRule.respondWith
    : () => matchedRule.respondWith;
  return execMockFunc(respondWith, req, res, next);
}