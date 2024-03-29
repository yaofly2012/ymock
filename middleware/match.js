/*
* 检查是否配置当前请求，
* 并把匹配的规则保存在req.matchedRule属性上
*/
const { 
  logger, 
  getConfigFile, 
  isArray, 
  isString,
  isRegExp,
  isFunction
} = require('../utils/util'); 

module.exports = function(req, _, next) {
	logger.info(`Handling request: ${req.url}`);
  req.matchedRule = doMatch(req);
  logger.success('[match]');
  next();
}

/*
* Find the matched rule
*/
function doMatch(req){
	const mockConfigFile = getConfigFile();
  let config = null;
  let url = req.url;
	
	// 解决非跨域请求url没有host信息问题
	if(!req.headers['origin'] && url[0] === '/'){
		url = 'http://' + req.headers['host'] + url;
	}

	try {
    // 解析mock配置文件
    config = require(mockConfigFile); 			
  } catch(e){
    logger.error('************* Fialed to parse file ymockcfg.js *************  ')
    logger.info(e);
    throw new Error('Error: Fialed to parse file ymockcfg.js. Look at terminal for detail info');
  }

  if(!isArray(config)){
    throw new Error(`Error: Exports of module ${mockConfigFile} must be a array`);
  }
  
  const rule = config.find(rule => {
    // 兼容之前的版本
    const test = rule.pattern === void 0 ? rule.test : rule.pattern;
    return (isString(test) && test === url)
      || (isRegExp(test) && test.test(url))
      || (isFunction(test) && test(req));
  });

  if(!rule) {
    logger.error('[miss]');
    const error = new Error('miss');
    error.ignoreLog = true; // 没找到匹配的rule，则打印stack信息    
    throw error;
  }
  return rule;
}