/*
* 检查是否配置当前请求，
* 并把匹配的规则保存在req.matchedRule属性上
*/
'use strict';
const qMockUtil = require('../utils/util'); 

var parseErrorRule = [
	{
		pattern: function() { 
			return true 
		},
		respondWith: function(){
			return '解析ymockcfg.js文件错误！请查看终端输出日志';
		}
	}
];

function _match(req){
	var url = req.url;
	// 解决非跨域请求url没有host信息问题
	if(!req.headers['origin'] && url[0] === '/'){
		url = 'http://' + req.headers['host'] + url;
	}
	var config = null;
	try {
		config = require(qMockUtil.getConfigFile()); // 为了热更新	
	} catch(e){
		console.log('*************  解析配置文件错误！*************  ')
		console.log(e);
		config = parseErrorRule;
	}

	if(!qMockUtil.isArray(config)){
		console.error(`\t${qMockUtil.getConfigFile()}格式不正确`);
		return;
	}
	var matchedRule = config.find(function(rule){
		return (qMockUtil.isString(rule.pattern) && rule.pattern === url)
			|| (qMockUtil.isRegExp(rule.pattern) && rule.pattern.test(url))
			|| (qMockUtil.isFunction(rule.pattern) && rule.pattern(req));
	});

	return matchedRule;
}

module.exports = function(req, res, next) {
	req.matchedRule = _match(req);
	var msg = `处理请求: ${req.url}\n匹配结果：${!!req.matchedRule ? '匹配': '不匹配'}`;
	console.log(msg);
	if(!req.matchedRule || req.matchedRule && !req.matchedRule.respondWith){
		if(!req.matchedRule) {
			res.writeHead(404);
		} else {
			res.writeHead(500);
			msg = `respondWith属性不合法`;
			console.error(msg);
		}
		res.setHeader('Content-Type', 'text/plain; charset=utf-8');
		res.end(msg);
		return;
	}
	next();
};
