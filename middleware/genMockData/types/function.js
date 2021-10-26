
const { logger, isString, isFunction } = require('../../../utils/util');
const str = require('./str');

/*
  执行函数，
  如果函数返回.json，.mockjson文件名，则读取文件内容
  如果返回undefined，则默认为responseWith函数自己操作response
*/
module.exports = function fun(func, req, res, next) {  
  return Promise.resolve(func(req, res, next))
    .then(result => {
      // 如果返回的是字符串
      if(isString(result)){
        return str(result, req, res);
      }
      // 如果是函数，则执行该函数
      if(isFunction(result)) {
        return fun(result, req, res, next);
      }
      return result;
    });
}