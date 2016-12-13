/**
* qmock配置模块。
*
* 功能：用于配置匹配mock请求的规则。
*
* 该模块就是一个普通的nodejs模块。
* 但对该模块增加了热更新功能，编辑该文件后不必重新启动服务。
* 
* url匹配规则举例：
* module.exports = [
* 	{
* 		pattern: /test\.json/,
* 		responseWith: test.json' // json file
* 	},
*	{
* 		pattern: /detail\.json/,
* 		responseWith: test.mockjson' // mockjson file
* 	},
*	{
* 		pattern: /list\.json/,
* 		responseWith: function(postData, qs){ // Function，根据请求参数，返回mock数据文件
*			return 'list' + postData.pageIndex	+ '.json';
*		}
* 	},
*	{
* 		pattern: /list\.json/,
* 		responseWith: function(postData, qs, req, res){ // 自定义返回mock数据
*			res.end('hello');
*		}
* 	}
* ];
*/
module.exports = [
	{

	}
];