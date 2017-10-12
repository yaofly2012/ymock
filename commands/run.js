/**
* 启动mock服务
*/
'use strict'
const http = require('http');
const fs = require('fs');
const path = require('path');
const connect = require('connect');
const bodyParser = require('body-parser');
const qMockUtil = require('../utils/util.js');
const match = require('../middleware/match.js');
const crossDomain = require('../middleware/crossDomain.js');
const mock = require('../middleware/mock.js');

/**
* 通过简单的方式实现mockcfg.js文件热更新。
* 注意：不要在Module上下文中引用mockcfg.js模块，参考match.js模块是如何引用mockcfg模块的。
*/
function hotUpdateMockCfg(){
	var mockcfgPath = require.resolve(qMockUtil.getConfigFile());
	fs.watch(mockcfgPath, function(){
		var module = require.cache[mockcfgPath];
		if(module && module.parent) {
			module.parent.children.splice(module.parent.children.indexOf(module), 1);
		}
		require.cache[mockcfgPath] = null;
	});
}

module.exports = function(port){
	if(!qMockUtil.existConfigFile()){
		console.error('当前目录不存在ymockcfg.js文件');
		return;
	}
	var app = connect();
	app.use(match)
		.use(crossDomain) // 只对mock的请求进行CORS处理
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({ extended: true }))
		.use(mock);

	var server = http.createServer(app);
	server.listen(port);

	server.on('listening', function(){
		console.log('服务启动成功，端口：' + port);
	});

	server.on('error', function(e){
		switch(e.code){
			case 'EADDRINUSE':
				console.error(`服务启动失败，端口${port}被占用了！`);
				break;
			default:
				console.error('服务启动失败，' + e.code);
		}
	});

	// 此处开启qmockcfg热更新
 	hotUpdateMockCfg();
};