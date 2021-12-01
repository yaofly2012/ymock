/**
* 启动mock服务
*/
const http = require('http');
const fs = require('fs');
const connect = require('connect');
const cors = require('cors');
const bodyParser = require('body-parser');
const query = require('../middleware/query')
const match = require('../middleware/match.js');
const genMockData = require('../middleware/genMockData');
const errorHandle = require('../middleware/errorHandle');
const { existConfigFile, getConfigFile, logger } = require('../utils/util.js');

module.exports = function(port) {
	if(!existConfigFile()){
		logger.error(`${getConfigFile()} not exist`);
		return;
	}
  // 启动服务
	runApp(port);
	// 此处开启qmockcfg热更新
 	hotUpdateMockCfg();
}

function runApp(port) {
  const app = connect();
	app
    .use(cors({
			origin: true,			
			credentials: true,
			maxAge: 1000 * 60 * 60 * 24
		}))
		.use(bodyParser.json())
		.use(bodyParser.urlencoded({ extended: true }))
    .use(query)
    .use(match)
		.use(genMockData)
    .use(errorHandle);

	const server = http.createServer(app);
	server.listen(port);

	server.on('listening', () => {
		logger.success(`Service is runing on ${port}`);
	});

	server.on('error', e => {
		switch(e.code){
			case 'EADDRINUSE':
				logger.error(`Failed to launch service, port ${port} used already`);
				break;
			default:
				logger.error(`Failed to launch service, ${e.code}`);
		}
		process.exit(1);
	});
}

/**
* 通过简单的方式实现mockcfg.js文件热更新。
* 注意：不要在Module上下文中引用mockcfg.js模块，参考match.js模块是如何引用mockcfg模块的。
*/
function hotUpdateMockCfg(){
	const mockcfgPath = require.resolve(getConfigFile());
	fs.watch(mockcfgPath, () => {
    const mod = require.cache[mockcfgPath];
    if(!mod){
      return;
    }
    //remove children
    if(mod.children){
      mod.children.length = 0;
    }
    //remove require cache
    delete require.cache[mockcfgPath];
	});
}