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
  try {
    req.matchedRule = doMatch(req);
    logger.success('[match]');
    next();
  } catch(e) {
		next(e);
  }
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
    return (isString(rule.pattern) && rule.pattern === url)
      || (isRegExp(rule.pattern) && rule.pattern.test(url))
      || (isFunction(rule.pattern) && rule.pattern(req));
  });

  if(!rule) {
    logger.error('[no match]');
    const error = new Error('no match');
    error.ignoreLog = true; // 没找到匹配的rule，则打印stack信息    
    throw error;
  }
  return rule;
}