#!/usr/bin/env node
'use strict';

const program  = require('commander');

// Version
program.version(require('../package.json').version || '0.0.1');

// init command
program
	.command('init [name]')
	.description('初始化ymock项目, [name]指定项目名称，默认为ymock')
	.action(function(name){
		var init = require('../commands/init.js');
		init(name);
	});

// run command
program
	.command('run')
	.description('启动mock服务')
	.option('-p, --port [port]', '指定端口号，默认8080', 8080)
	.action(function(){	
		var mock = require('../commands/run.js');
		mock(this.port);
	});

program.parse(process.argv);

process.on('error', function(error){
	console.log(error);
});