/**
* 工具函数
*/
'use strict';

const path = require('path');
const fs = require('fs');

var util = {};

// isNumber, isString... utils
['Number', 'String', 'Boolean', 'Null', 'Undefined', 'Object', 'Array', 'Function', 'Date', 'RegExp'].forEach(function(type){
	util['is' + type] = (function(type){
		return function(obj){
			return Object.prototype.toString.call(obj) === ('[object ' + type + ']');
		};
	})(type);
});

// 获取qmock config文件路径
util.getConfigFile = function(){
	return path.join(process.cwd(), 'ymockcfg.js');
}

// 判断当前是否存在配置文件
util.existConfigFile = function(){
	return fs.existsSync(util.getConfigFile());
}

module.exports = util;