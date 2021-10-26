const path = require('path');
const fs = require('fs');

// 解析Json文件
module.exports = function fileJson(fileName, _, res) {
  const absoluteFilePath = path.join(process.cwd(), fileName);
  if(!fs.existsSync(absoluteFilePath)) {
    throw new Error(`File ${absoluteFilePath} not exist`);
  }
  res.writeHead(200, { 'Content-Type': 'application/json'});
  const readStream = fs.createReadStream(absoluteFilePath, { encoding: 'utf-8' });    
  readStream.pipe(res);
}