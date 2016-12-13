/**
* 
*/
'use strict';
const url = require('url');
const httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});
proxy.on('error', function(e){
	console.log('Proxy: ' + e);
});

var passthrought = function(req, res, next){
	var urlObj =  url.parse(req.url);
	var target = `${urlObj.protocol}//${urlObj.host}`;
	proxy.web(req, res, { 
		target: target
	});
};

module.exports = passthrought;