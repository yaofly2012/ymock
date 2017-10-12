/**
* 跨域请求，处理res头部
*/
'use strict';

module.exports = function(req, res, next){
	// 跨域情况才处理匹配请求res
	if(req.headers['origin']){
		res.setHeader('Access-Control-Allow-Origin', req.headers['origin']);
		res.setHeader('Access-Control-Allow-Credentials', true);
		if(req.method.toUpperCase() === 'OPTIONS') {
			res.setHeader('Access-Control-Allow-Headers', req.headers['Access-Control-Request-Headers'.toLowerCase()]);
			res.setHeader('Access-Control-Allow-Methods', req.method);
			res.setHeader('Access-Control-Max-Age', 86400); // 24H
			res.end();
			return;
		}
	}
	next();
};