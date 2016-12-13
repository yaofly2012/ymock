/**
* 工具函数
*/
'use strict';

const path = require('path');

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

module.exports = util;