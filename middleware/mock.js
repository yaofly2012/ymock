/**
* 处理 mock
*/
'use strict';
const qs = require('querystring');
const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');
const qMockUtil = require('../utils/util.js');
const mockJson = require('../utils/mockJson.js');

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

// 执行函数，如果函数返回.json文件名，则读取文件内容
execMock[respondWithTypeObj.func] = function(func, req, res){
	var qsObj = qs.parse(url.parse(req.url).query);
	var result = func(req.body, qsObj, req, res);
	// 如果返回的是字符串
	if(qMockUtil.isString(result)){
		return this[respondWithTypeObj.str](result, req, res);
	}

	return result;
};

// 字符串
execMock[respondWithTypeObj.str] = function(str, req, res){
	var data = str;
	switch(path.extname(str)){
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
		data = `${absoluteFilePath}文件不存在`;
		console.error(data);
		return data;
	} 

	data = fs.readFileSync(absoluteFilePath, { encoding: 'utf-8'});
	try{
		return JSON.parse(data);
	} catch(e){
		data = `${absoluteFilePath}文件内容不是合法的JSON`;
		console.error(data);
	}
	return data;
};

// 解析mockjson 文件
execMock[respondWithTypeObj.mockJsonFile] = function(fileName, req, res){
	var data = this[respondWithTypeObj.jsonFile](fileName, req, res);
	if(qMockUtil.isObject(data)){
		data = mockJson.generateFromTemplate(data);
	}
	return data;
}

// Get mock data
function getMockData(req, res){
	debugger;
	var mockData, 
		respondWithType = respondWithTypeObj.none,
		matchedRule = req.matchedRule;
	if(qMockUtil.isFunction(matchedRule.respondWith)){
		respondWithType = respondWithTypeObj.func;
	} else if(qMockUtil.isString(matchedRule.respondWith)){
		respondWithType = respondWithTypeObj.str;
	}

	mockData = execMock[respondWithType](matchedRule.respondWith, req, res);
	return mockData;
}

module.exports = function(req, res, next) {
	if(!req.matchedRule){
		next();
		return;
	}
	var mockData = getMockData(req, res) || '';
	if(qMockUtil.isString(mockData)){
		res.setHeader('Content-Type', 'text/plain');
	}else{
		res.setHeader('Content-Type', 'application/json');
		mockData = JSON.stringify(mockData);
	}
	res.end(mockData);
};