# ymock


[![NPM Version](http://img.shields.io/npm/v/ymock.svg?style=flat)](https://www.npmjs.org/package/ymock)
[![NPM Downloads](https://img.shields.io/npm/dm/ymock.svg?style=flat)](https://www.npmjs.org/package/ymock)

	给我一个URL，返给你个JSON数据。
	
	
## 安装
### 预置条件
先安装[nodejs](https://nodejs.org/en/download/)
### 执行安装命令
```
$ npm install -g ymock
```
## 快速开始
+ 创建ymock项目(当前工作目录是user/study/ymock)

```
ymock init demo1
```

执行成功后会在当前目录下创建demo1目录，并在在demo1目录里创建文件ymockcfg.js。
``` javascript
module.exports = [
   	{
   	}
   ];
```
这个文件就是你生成JSON数据的配置文件了。

+ 创建用户信息JSON数据

在ymockcfg.js同级目录中创建data目录，并创建json文件user.json：

``` json
{
	"name": "john",
	"age": "24"
}
```

+ 在ymockcfg.js中添加请求匹配规则配置

```javascript
module.exports = [
	{
		pattern: /user\.json/,
		respondWith: 'data/user.json'
	}
];
```

+ 启动ymock服务：

```
$ ymock run
```

+ 查看生成的JSON数据

在浏览器中输入地址：http://127.0.0.1:8080,不出意外就可以看到输出的数据了。
## 细说ymockcfg.js
ymockcfg.js本质上就是一个nodejs模块（不过修改该文件，不用重启服务），该模块返回的是个数组，在数组中添加URL匹配规则以及对应的JSON数据。
数组的元素格式：
``` javascript
{
		pattern: /user\.json/,
		respondWith: 'data/user.json'
}
```
其中：

pattern属性定义URL匹配规则，目前该属性可取值为字符串，正则表达式，和函数。

respondWith属性定义JSON数据生成方式，目前该属性可取值字符串，函数。
### pattern取值—字符串
采用精确匹配策略，接着上面的举例，修改ymockcfg.js:
```javascript
module.exports = [
	{
		pattern: 'http://127.0.0.1:8080/user.json',
		respondWith: 'data/user.json'
	}
];
```
只有当请求URL为"http://127.0.0.1:8080/user.json"时才能匹配。
### pattern取值—正则表达式
采用正则匹配的方式，如【快速开始】的举例
### pattern取值—函数
会把请求对象（[http.IncomingMessage](http://nodejs.cn/doc/node/http.html#http_class_http_incomingmessage)）作为参数传给该函数，如果函数返回true则匹配成功，否则不匹配。这是最灵活的一种方式。
继续修改ymockcfg.js:
```
{
		pattern: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'data/user.json'
}
```
### respondWith取值—普通字符串
respondWith可以取值字符串，此时作为text/plain格式字符串返回的。
修改ymockcfg.js：
```javascript
module.exports = [
	{
		pattern: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'hi ymock!'
	}
];
```
### respondWidth取值—JSON文件字符串
如果字符串以".json"结尾则认为是相对于当前目录的JSON文件。如【快速开始】举例。
### respondWidth取值—mockjson文件字符串
如果字符串以".mockjson"结尾则认为是相对于当前目录的MockJSON文件。
继续上面的举例（此时要mock 5条用户数据的列表），在data目录添加userlist.mockjson文件（[mockJSON语法](http://experiments.mennovanslooten.nl/2010/mockjson/)）：
```json
{
	"data|5-5": [
		{
			"name": "@MALE_FIRST_NAME",
			"age|20-24": 0
		}
	]
}
```
修改ymockcfg.js：
```javascript
module.exports = [
	{
		pattern: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'hi ymock!'
	},
	{
		pattern: /userlist\.json/,
		respondWith: 'data/userlist.mockjson' // 返回mockjson文件
	}
];
```
在浏览器中访问http://127.0.0.1:8080/userlist.json，会发现生产5跳数据。
### respondWith取值—函数
如果你想更加自由的控制mock的数据，那就给respondWith赋值个函数吧。此时会把函数的返回值作为mock数据。不过你也可以不返回数据，直接在函数中直接操作response来确定返回值。
先来个栗子(根据请求参数决定mock数据)。修改ymockcfg.js:
```javascript
module.exports = [
	{
		pattern: /user\.json/,
		respondWith: function(postData, qs, req, res){
			return {
				name: qs.name
			}
		}
	}
];
```
访问http://127.0.0.1:8080/user.json?name=john，则输出：
``` javascript
{ name: "john"}
```
根据请求中QueryString的参数不同，而输出的mock数据也不同。
#### respondWith函数的参数
respondWidth的函数参数分别是：
请求POST的数据，
请求QueryString参数，
请求对象（[http.IncomingMessage](http://nodejs.cn/doc/node/http.html#http_class_http_incomingmessage)），
响应对象（[http.ServerResponse](http://nodejs.cn/doc/node/http.html#http_class_http_serverresponse)）
#### respondWith函数返回值
返回值可以是JSON对象也可以是字符串。并且如果返回值是以".json"结尾的字符串，则视为相对于当前目录的JSON文件，
```javascript
module.exports = [
	{
		pattern: /user\.json/,
		respondWith: function(postData, qs, req, res){
			return 'data/user.json'; // 返回json文件名称字符串
		}
	}
];
```
同理如果以”.mockjson"结尾的字符串则视为相对于当前目录的mockjson文件：
```javascript
module.exports = [
	{
		pattern: /user\.json/,
		respondWith: function(postData, qs, req, res){
			return 'data/userlist.mockjson';
		}
	}
];
```

## ymock命令介绍
执行命令可以查看ymock命令的帮助：
```
$ ymock -h
```
### init
执行下面命令查看init子命令的帮助
```
$ ymock init -h
```

### run -p [port]
执行下面命令查看run子命令的帮助
```
$ ymock run -h
```

## 结束语
如果你有兴趣欢迎添砖加瓦！

程序猿何必难为程序猿
