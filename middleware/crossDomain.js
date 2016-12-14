/**
* 处理跨域
*/
'use strict';
module.exports = function(req, res, next){
	console.log('处理请求：' + req.url);
	var origin = req.headers['origin'] || '*';
	res.setHeader('Access-Control-Allow-Origin', origin);
	res.setHeader('Access-Control-Allow-Credentials', 'true');
	if(req.method === 'OPTIONS') {
		res.end();
		return;
	}
	next();
};