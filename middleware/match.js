/*
* 检查是否配置当前请求，
* 并把匹配的规则保存在req.matchedRule属性上
*/
'use strict';
const qMockUtil = require('../utils/util'); 

function _match(req){
	var url = req.url;
	debugger;
	var config = require(qMockUtil.getConfigFile()); // 为了热更新
	if(!qMockUtil.isArray(config)){
		console.error(`\t${qMockUtil.getConfigFile()}格式不正确`);
		return;
	}
	var matchedRule = config.find(function(rule){
		if(qMockUtil.isString(rule.pattern)){
			if(rule.pattern === url) {
				return true;
			}
		} else if(qMockUtil.isRegExp(rule.pattern)){
			if(rule.pattern.test(url)){
				return true;
			}
		} else if(qMockUtil.isFunction(rule.pattern)){
			if(rule.pattern(req)){
				return true;
			}
		}
	});

	return matchedRule;
}

module.exports = function(req, res, next) {
	req.matchedRule = _match(req);
	console.log(`\t匹配结果：${!!req.matchedRule ? '匹配': '不匹配'}`);
	if(req.matchedRule && !req.matchedRule.respondWith){
		var msg = `${req.matchedRule}对应的respondWith属性不合法`;
		console.error('\t' + msg);
		res.end(msg);
		return;
	}
	next();
};
