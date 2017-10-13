/*
* 检查是否配置当前请求，
* 并把匹配的规则保存在req.matchedRule属性上
*/
'use strict';
const yMockUtil = require('../utils/util'); 
const logger = yMockUtil.logger;

var genErrorRuleConfig = function(msg) {
	return {
		pattern: function() { 
			return true 
		},
		respondWith: function(){
			return msg;
		},
		hasError: true
	}
}

function _match(req){
	var url = req.url, 
		mockConfigFile = yMockUtil.getConfigFile(),
		config = null;
	// 解决非跨域请求url没有host信息问题
	if(!req.headers['origin'] && url[0] === '/'){
		url = 'http://' + req.headers['host'] + url;
	}
	try {
		config = require(mockConfigFile); // 为了热更新	
	} catch(e){
		logger.error('************* Fialed to parse file ymockcfg.js *************  ')
		logger.info(e);
		return genErrorRuleConfig('Fialed to parse file ymockcfg.js. Look at terminal for detail info');
	}

	if(!yMockUtil.isArray(config)){
		var msg = `Exports of module ${mockConfigFile} must be a array`;
		logger.error(msg);
		return genErrorRuleConfig(msg);
	}
	var matchedRule = config.find(function(rule){
		return (yMockUtil.isString(rule.pattern) && rule.pattern === url)
			|| (yMockUtil.isRegExp(rule.pattern) && rule.pattern.test(url))
			|| (yMockUtil.isFunction(rule.pattern) && rule.pattern(req));
	});

	return matchedRule;
}

module.exports = function(req, res, next) {
	logger.info(`Handling request: ${req.url}`);
	var matchedRule = _match(req);
	var msg = '';
	if(!matchedRule){
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		if(!matchedRule) {
			res.writeHead(404);
			msg = '[no match]';
		} else {
			res.writeHead(500);
			msg = `Property respondWith illegal`;
		}
		logger.error(msg);
		res.end(msg);
		return;
	}
	if(!matchedRule.hasError) {
		logger.success('[match]');
	}
	req.matchedRule = matchedRule;
	next();
};
