/**
* 处理 mock
*/
'use strict';
const qs = require('querystring');
const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');
const yMockUtil = require('../utils/util.js');
const mockJson = require('../utils/mockJson.js');
const logger = yMockUtil.logger;
const respondWithTypeObj= {
	'none': '',
	'func': 'func',
	'str': 'str',
	'jsonFile': 'jsonFile',
	'mockJsonFile': 'mockJsonFile'
};

var execMock = {};
execMock[respondWithTypeObj.none] = function(){
	return '';
};

/*
 执行函数，
 如果函数返回.json，.mockjson文件名，则读取文件内容
 如果返回undefined，则默认为responseWith函数自己操作response
*/
execMock[respondWithTypeObj.func] = function(func, req, res){
	var data = req.method.toUpperCase() === 'POST' ? req.body : qs.parse(url.parse(req.url).query);
	var result;
	try {
		result = func(data, req, res);	
	} catch(e) {
		logger.error(e);
		result =  'Error: failed to execute function respondWith';
	}
	// 如果返回的是字符串
	if(yMockUtil.isString(result)){
		return this[respondWithTypeObj.str](result, req, res);
	} 
	// 如果是函数，则执行该函数
	if(yMockUtil.isFunction(result)) {
		return execMock[respondWithTypeObj.func](result, req, res);
	}
	return result;
};

// 字符串
execMock[respondWithTypeObj.str] = function(str, req, res){
	var data = str;
	switch(path.extname(str).toLowerCase()){
		case '.json':
			data = this[respondWithTypeObj.jsonFile](str, req, res);
			break;
		case '.mockjson':
			data =  this[respondWithTypeObj.mockJsonFile](str, req, res);
			break;
	}

	return data;
}

// 解析Json文件
execMock[respondWithTypeObj.jsonFile] = function (fileName, req, res){
	var absoluteFilePath = path.join(process.cwd(), fileName), 
		data = '';
	if(!fs.existsSync(absoluteFilePath)){
		data = `File ${absoluteFilePath} not exist`;
		logger.error(data);
		return data;
	} 	
	try{
		data = fs.readFileSync(absoluteFilePath, { encoding: 'utf-8'});
		return JSON.parse(data);
	} catch(e){
		data = `The content of file ${absoluteFilePath} is illegal JSON:\n${data}`;
		logger.error(data);
	}
	return data;
};

// 解析mockjson 文件
execMock[respondWithTypeObj.mockJsonFile] = function(fileName, req, res){
	var data = this[respondWithTypeObj.jsonFile](fileName, req, res);
	if(yMockUtil.isObject(data)){
		data = mockJson.generateFromTemplate(data);
	}
	return data;
}

// Get mock data
function getMockData(req, res){
	var mockData, 
		respondWithType = respondWithTypeObj.func,
		respondWith = req.matchedRule.respondWith;
	// 如果respondWith不是函数，则转成函数处理方式
	if(!yMockUtil.isFunction(respondWith)){
		var temp = respondWith;
		respondWith = function() {			
			return temp;
		}
	}
	mockData = execMock[respondWithType](respondWith, req, res);
	return mockData;
}

module.exports = function(req, res, next) {
	var mockData = getMockData(req, res);
	// 如果直接赋值undefined, 则转成字符串形式，它不属于JSON类型
	if(yMockUtil.isUndefined(mockData)) {
		mockData += ''; 
	}
	mockData = JSON.stringify(mockData);
	res.setHeader('Content-Type', 'application/json');
	res.end(mockData);
};