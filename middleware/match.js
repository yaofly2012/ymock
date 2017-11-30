/*
* 检查是否配置当前请求，
* 并把匹配的规则保存在req.matchedRule属性上
*/
'use strict';
const yMockUtil = require('../utils/util'); 
const logger = yMockUtil.logger;

function genResult(success, data, code) {
	return {
		success: success,
		code: code,
		data: data
	}
}

/*
* Find the matched rule
*/
function _match(req){
	var url = req.url, 
		mockConfigFile = yMockUtil.getConfigFile(),
		config = null,
		data, 
		code,
		success = false;
	// 解决非跨域请求url没有host信息问题
	if(!req.headers['origin'] && url[0] === '/'){
		url = 'http://' + req.headers['host'] + url;
	}
	for(var i = 0; i < 1; ++i) {
		try {
			// 解析mock配置文件
			config = require(mockConfigFile); 			
		} catch(e){
			logger.error('************* Fialed to parse file ymockcfg.js *************  ')
			logger.info(e);
			data = 'Error: Fialed to parse file ymockcfg.js. Look at terminal for detail info';
			code = 500;
			break;
		}
		if(!yMockUtil.isArray(config)){
			data = `Error: Exports of module ${mockConfigFile} must be a array`;
			code = 500;
			break;
		}
		var data = config.find(function(rule){
			return (yMockUtil.isString(rule.pattern) && rule.pattern === url)
				|| (yMockUtil.isRegExp(rule.pattern) && rule.pattern.test(url))
				|| (yMockUtil.isFunction(rule.pattern) && rule.pattern(req));
		});
		if(!data) {
			data = '[no match]';
			code = 404;
			break;
		}
		success = true;
	}
	return genResult(success, data, code);
}

module.exports = function(req, res, next) {
	logger.info(`Handling request: ${req.url}`);
	var matchedResult = _match(req);
	if(!matchedResult.success){
		logger.error(matchedResult.data);
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.writeHead(matchedResult.code);
		res.end(matchedResult.data);
		return;
	}
	logger.success('[match]');
	req.matchedRule = matchedResult.data;
	next();
};
