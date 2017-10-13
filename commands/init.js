/**
* 初始化qmock项目
* 
* 当前目录下创建ymock项目，默认项目名称是qmock,
* 并在该项目下创建ymockcfg.js文件
*/
'use strcit';
const fs = require('fs');
const path = require('path');
const logger = require('../utils/util.js').logger;

module.exports = function(name){
	var projectName = path.join(process.cwd(), name || 'ymock');
	var config = path.join(projectName, 'ymockcfg.js');
	var configTpl = path.join(__dirname, '../ymockcfg.js');
	
	if(!fs.existsSync(projectName)){
		fs.mkdirSync(projectName);
		logger.info(`> Dir ${projectName} created successfully`);
	} else {
		logger.info(`> Dir ${projectName} existed already`);
	}

	if(!fs.existsSync(config)){
		fs.writeFileSync(config, fs.existsSync(configTpl) ? fs.readFileSync(configTpl) : '');
		logger.info(`> File ${config} created successfully`);
	} else {
		logger.info(`> File ${config} existed already`);
	}
	logger.success(`Project ${name || 'ymock'} init successfully`);
}