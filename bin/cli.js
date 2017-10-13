#!/usr/bin/env node
'use strict';

const program  = require('commander');

// Version
program.version(require('../package.json').version || '0.0.1');

// init command
program
	.command('init [name]')
	.description('Init ymock project, project name is specified by param [name], and default is ymock')
	.action(function(name){
		var init = require('../commands/init.js');
		init(name);
	});

// run command
program
	.command('run')
	.description('Launch ymock service')
	.option('-p, --port [port]', 'port, default is 8080', 8080)
	.action(function(){	
		var mock = require('../commands/run.js');
		mock(this.port);
	});

program.parse(process.argv);

process.on('error', function(error){
	console.log(error);
});