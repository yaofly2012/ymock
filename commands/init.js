/**
* 初始化qmock项目
* 
* 当前目录下创建qmock项目，默认项目名称是qmock,
* 并在该项目下创建qmockcfg.js文件
*/
'use strcit';
const fs = require('fs');
const path = require('path');

module.exports = function(name){
	var projectName = path.join(process.cwd(), name || 'ymock');
	var config = path.join(projectName, 'ymockcfg.js');
	var configTpl = path.join(__dirname, '../ymockcfg.js');
	
	if(!fs.existsSync(projectName)){
		fs.mkdirSync(projectName);
		console.log(projectName + '创建成功');
	} else {
		console.log(projectName + '已经存在');
	}

	if(!fs.existsSync(config)){
		fs.writeFileSync(config, fs.existsSync(configTpl) ? fs.readFileSync(configTpl) : '');
		console.log(config + '创建成功');
	} else {
		console.log(config + '已经存在');
	}
	console.log(`${name || 'ymock'}初始化成功`);
}