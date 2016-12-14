/**
* 如果没有匹配URL，则作为代理转发出去。
* 注意：要在body-parse之前执行该模块。
*/
'use strict';
const url = require('url');
const httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});
proxy.on('error', function(error, req, res, target){
	debugger;
	res.writeHead(500, {
		'Content-Type': 'text/plain'
	});
	res.end(error.message || 'proxy error');
});

module.exports = function(req, res, next){
	if(!!req.matchedRule){
		next();
		return;
	}
	var urlObj =  url.parse(req.url);
	if(!urlObj.protocol || !urlObj.host){
		res.writeHead(404);
		res.end();
		return;
	}
	debugger;
	var target = `${urlObj.protocol}//${urlObj.host}`;
	proxy.web(req, res, { 
		target: target
	});
};