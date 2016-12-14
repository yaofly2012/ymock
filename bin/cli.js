#!/usr/bin/env node
'use strict';

const program  = require('commander');

// Version
program.version(require('../package.json').version || '0.0.1');

// init command
program
	.command('init [name]')
	.option('-h, --help', '查看init命令帮助', function(){
		console.log('');
		console.log('命令：ymock init [name]')
		console.log('功能：初始化ymock项目, [name]指定项目名称，默认为ymock。');
		process.exit(0);
	})
	.action(function(name){
		var init = require('../commands/init.js');
		init(name);
	});

// run command
program
	.command('run')
	.option('-p, --port [port]', '指定端口号', 8080)
	.option('-h, --help', '查看run命令帮助', function(){
		console.log('');
		console.log('命令：ymock run [-p 8080]');
		console.log('功能：启动mock服务');
		process.exit(0);
	})
	.action(function(options){	
		var mock = require('../commands/run.js');
		mock(options.port);
	});

program.parse(process.argv);

process.on('error', function(error){
	console.log(error);
});