const path = require('path');
const fs = require('fs');
const {
  logger,
  isString,
  isFunction,
  isObject
} = require('../../utils/util');
const mockJson = require('../../utils/mockJson');

// Get mock data
module.exports = function genMockData(req, res) {
  let respondWith = req.matchedRule.respondWith;
	// 如果respondWith不是函数，则转成函数处理方式
	if(!isFunction(respondWith)) {
		respondWith = () => respondWith;
	}
  return execMockFunc(respondWith, req, res);
}

/*
  执行函数，
  如果函数返回.json，.mockjson文件名，则读取文件内容
  如果返回undefined，则默认为responseWith函数自己操作response
*/
function execMockFunc(func, req, res) {  
  let result;
  try {
    result = func(req.reqData, req, res);	
  } catch(e) {
    logger.error(e);
    throw e;
  }
  // 如果返回的是字符串
  if(isString(result)){
    return execMockStr(result, req, res);
  }
  // 如果是函数，则执行该函数
  if(isFunction(result)) {
    return execMockFunc(result, req, res);
  }
  return result;
}

// 字符串
function execMockStr(str, req, res){
	let data = str;
	switch(path.extname(str).toLowerCase()){
		case '.json':
			data = execMockJsonFile(str, req, res);
			break;
		case '.mockjson':
			data = execMockMockJsonFile(str, req, res);
			break;
	}
	return data;
}

// 解析Json文件
function execMockJsonFile(fileName) {
  const absoluteFilePath = path.join(process.cwd(), fileName);
	if(!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File ${absoluteFilePath} not exist`);
  }
  const data = fs.readFileSync(absoluteFilePath, { encoding: 'utf-8' });
  return JSON.parse(data);
}

// 解析mockjson 文件
function execMockMockJsonFile(fileName, req, res){
  const template = execMockJsonFile(fileName, req, res);
  if(!isObject(template)) {
    throw new Error(`Invalid content of mock json file ${fileName}`);
  }
  return mockJson.generateFromTemplate(template);
}