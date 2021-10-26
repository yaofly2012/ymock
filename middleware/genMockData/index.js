/**
* 处理 mock
*/
const genMockData = require('./types');

module.exports = function(req, res, next) {  
  Promise.resolve(genMockData(req, res, next))
    .then(mockData => {
      // 自定义响应
      if(res.headersSent) {
        return;
      }
      // 如果式undefined, 则转成字符串形式，它不属于JSON类型
      if(mockData === void 0) {
          mockData += '';
      }
      mockData = JSON.stringify(mockData);
      res.setHeader('Content-Type', 'application/json');
      res.end(mockData);
    })
    .catch(next);
}