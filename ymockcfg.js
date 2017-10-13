/**
* ymock配置模块。
*
* 功能：用于配置匹配mock请求的规则。
*
* 该模块就是一个普通的nodejs模块。
* 但对该模块增加了热更新功能，编辑该文件后不必重新启动服务。
* 
* url匹配规则举例：
* module.exports = [
*	{
* 		pattern: /test\.json/, // 正则表达式形式，
* 		respondWith: 1 // 任意非函数数据 nuber, null, undefined, Object
* 	},
* 	{
* 		pattern: /test\.json/, // 正则表达式形式，
* 		respondWith: 'test.json' // json文件，相对于当前目录
* 	},
*	{
* 		pattern: /detail\.json/,
* 		respondWith: test.mockjson' // mockjson 文件，相对于当前目录
* 	},
*	{
* 		pattern: /list\.json/,
* 		respondWith: function(postData, qs){ // Function，根据请求参数，返回mock数据文件，相对于当前目录
*			return 'list' + postData.pageIndex	+ '.json';
*		}
* 	},
*	{
* 		pattern: /list\.json/,
* 		respondWith: function(postData, qs, req, res){ // 自定义返回mock数据
*			res.end('hello');
*		}
* 	},
*	{
* 		pattern: 'https://github.com/yaofly2012/ymock', // 字符串形式，精确匹配
* 		respondWith: 'test.json'
* 	},
*	{
* 		pattern: function(req) {, // 诊断函数形式，根据函数值判断是否匹配
*			// 判断逻辑
*			return boolean;
*		}
* 		respondWith: 'test.json' 
* 	},
* ];
*/
module.exports = [
	{
	}
];