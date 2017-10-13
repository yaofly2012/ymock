/**
* 启动mock服务
*/
'use strict'
const http = require('http');
const fs = require('fs');
const path = require('path');
const connect = require('connect');
const bodyParser = require('body-parser');
const yMockUtil = require('../utils/util.js');
const match = require('../middleware/match.js');
const crossDomain = require('../middleware/crossDomain.js');
const mock = require('../middleware/mock.js');
const logger = require('../utils/util.js').logger;
/**
* 通过简单的方式实现mockcfg.js文件热更新。
* 注意：不要在Module上下文中引用mockcfg.js模块，参考match.js模块是如何引用mockcfg模块的。
*/
function hotUpdateMockCfg(){
	var mockcfgPath = require.resolve(yMockUtil.getConfigFile());
	fs.watch(mockcfgPath, function(){
		var module = require.cache[mockcfgPath];
		if(module && module.parent) {
			module.parent.children.splice(module.parent.children.indexOf(module), 1);
		}
		require.cache[mockcfgPath] = null;
	});
}

module.exports = function(port){
	if(!yMockUtil.existConfigFile()){
		logger.error(`${yMockUtil.getConfigFile()} not exist`);
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
		logger.success(`Service is runing on ${port}`);
	});

	server.on('error', function(e){
		switch(e.code){
			case 'EADDRINUSE':
				logger.error(`Failed to launch service, port ${port} used already`);
				break;
			default:
				logger.error(`Failed to launch service, ${e.code}`);
		}
		process.exit(1);
	});

	// 此处开启qmockcfg热更新
 	hotUpdateMockCfg();
};