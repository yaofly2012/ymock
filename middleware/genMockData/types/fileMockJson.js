const path = require('path');
const fs = require('fs');
const { isObject } = require('../../../utils/util');
const mockJson = require('../../../utils/mockJson');

// 解析mockjson 文件
module.exports = function fileMockJson(fileName){
  const absoluteFilePath = path.join(process.cwd(), fileName);
  if(!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File ${absoluteFilePath} not exist`);
  }
  let template = fs.readFileSync(absoluteFilePath, { encoding: 'utf-8' });
  template = JSON.parse(template);
  if(!isObject(template)) {
    throw new Error(`Invalid content of mock json file ${fileName}`);
  }
  return mockJson.generateFromTemplate(template);
}