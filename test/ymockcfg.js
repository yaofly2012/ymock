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
* 	{
* 		test: /test\.json/,
* 		respondWith: test.json' // json file
* 	},
*	{
* 		test: /detail\.json/,
* 		respondWith: test.mockjson' // mockjson file
* 	},
*	{
* 		test: /list\.json/,
* 		respondWith: function(postData, qs){ // Function，根据请求参数，返回mock数据文件
*			return 'list' + postData.pageIndex	+ '.json';
*		}
* 	},
*	{
* 		test: /list\.json/,
* 		respondWith: function(postData, qs, req, res){ // 自定义返回mock数据
*			res.end('hello');
*		}
* 	}
* ];
*/
//module.exports = {};
module.exports = [	
	{
		test: /custom/,
		respondWith: function(req, res) {
			res.end('hello')
		}
	},
	{
		test: /test\.json/i,
		respondWith: function() {			
			return 'hello world!'
		}
	},
	{
		test: /b$/i,
		respondWith: function(){
			return function(){
				return function(){
          return 'data/list.jsoN'
				};
			}
		},
		respondWith21: function(req, res) {
			//res.write('custome')
			//return 1;
		},
		respondWith2: function(data, req){
			console.log(data);
			console.log(req.url);
			return 'data/list.jsoN'
		}
	},
	{
		test: /\/a/i,
		respondWith: (req, res) => {
			throw new Error('helo')
			return Promise.reject('12')
		}
	}
];