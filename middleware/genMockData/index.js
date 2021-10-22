/**
* 处理 mock
*/
const genMockData = require('./mockData');
const { isUndefined } = require('../../utils/util')

module.exports = function(req, res, next) {
    console.log('mw--genMockData')
    try {
        let mockData = genMockData(req, res);
        // 如果直接赋值undefined, 则转成字符串形式，它不属于JSON类型
        if(isUndefined(mockData)) {
            mockData += '';
        }
        mockData = JSON.stringify(mockData);
        res.setHeader('Content-Type', 'application/json');
        res.end(mockData);
    } catch(e) {
        next(e);
    }
}