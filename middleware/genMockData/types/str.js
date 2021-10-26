const path = require('path');
const fileJson = require('./fileJson');
const fileMockJson = require('./fileMockJson');

// 字符串
module.exports = function str(str, req, res){
	let data = str;
	switch(path.extname(str).toLowerCase()){
		case '.json':
			data = fileJson(str, req, res);
			break;
		case '.mockjson':
			data = fileMockJson(str, req, res);
			break;
	}
	return data;
}