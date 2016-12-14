/**
* 处理跨域
*/
'use strict';

const wildcard = '*';

module.exports = function(req, res, next){
	var origin = req.headers['origin'] || wildcard;
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader('Access-Control-Allow-Credentials', wildcard !== origin);
	if(req.method === 'OPTIONS') {
		res.setHeader('Access-Control-Allow-Headers', req.headers['Access-Control-Request-Headers'.toLowerCase()]);
		res.setHeader('Access-Control-Allow-Methods', req.headers['Access-Control-Request-Method'.toLowerCase()]);
		res.setHeader('Access-Control-Max-Age', 86400); // 缓存24H
		res.end();
		return;
	}
	next();
};