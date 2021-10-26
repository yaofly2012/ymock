# ymock

[![NPM Version](http://img.shields.io/npm/v/ymock.svg?style=flat)](https://www.npmjs.org/package/ymock)
[![NPM Downloads](https://img.shields.io/npm/dm/ymock.svg?style=flat)](https://www.npmjs.org/package/ymock)


给我一个URL，返给你个JSON数据。
[API documentation](https://github.com/yaofly2012/ymock)

# ymock能做什么
1. mock**接口数据**，并且支持mockjson模板；
2. mock**接口逻辑**，根据请求不同进行不同的mock数据生成。

# 安装
## 预置条件
先安装[nodejs](https://nodejs.org/en/download/)

## 执行安装命令
```sh
$ npm install -g ymock
```

# 快速开始
1. 创建ymock项目(当前工作目录是`user/study/ymock`)
  ```sh
  $ ymock init demo1
  ```

  执行成功后会在当前目录下创建demo1目录，并在在demo1目录里创建文件`ymockcfg.js`。
  ```js
  module.exports = [
    {
    }
  ];
  ```
  这个文件就是你生成JSON数据的配置文件了。

2. 创建用户信息JSON数据
  在ymockcfg.js同级目录中创建data目录，并创建json文件user.json：
  ```json
  {
    "name": "john",
    "age": "24"
  }
  ```

3. 在ymockcfg.js中添加请求匹配规则配置
  ```js
  module.exports = [
    {
      test: /user\.json/,
      respondWith: 'data/user.json'
    }
  ];
  ```

4. 启动ymock服务：
  ```sh
  $ ymock run
  ``` 

5. 查看生成的JSON数据
  在浏览器中输入地址：`http://127.0.0.1:8080`, 不出意外就可以看到输出的数据了。

# 细说ymockcfg.js
ymockcfg.js本质上就是一个nodejs模块（不过修改该文件，不用重启服务），该模块返回的是个数组，在数组中添加URL匹配规则以及对应的JSON数据。
数组的元素格式：
```js
{
  test: /user\.json/,
  respondWith: 'data/user.json'
}
```
## `test`属性
`test`属性定义URL匹配规则，目前该属性可取值为字符串，正则表达式和函数。

### `test`取值—字符串
采用精确匹配策略，接着上面的举例，修改ymockcfg.js:
```js
module.exports = [
	{
		test: 'http://127.0.0.1:8080/user.json',
		respondWith: 'data/user.json'
	}
];
```
只有当请求URL为`http://127.0.0.1:8080/user.json`时才能匹配。

### `test`取值—正则表达式
采用正则匹配的方式，如【快速开始】的举例。

### `test`取值—函数
会把请求对象（[http.IncomingMessage](http://nodejs.cn/doc/node/http.html#http_class_http_incomingmessage)）作为参数传给该函数，如果函数返回true则匹配成功，否则不匹配。这是最灵活的一种方式。
继续修改ymockcfg.js:
```js
{
		test: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'data/user.json'
}
```

## `respondWith`属性
`respondWith`属性定义JSON数据生成方式：
1. 如果`respondWith`取值为`number`, `null`, `boolean`, `undefined`, `Object`，则直接返回该数据;
2. 如果`respondWith`取值为`String`：
  - 如果该字符串以'.json'或者'.mockjson'结尾，则视为文件，读取该文件并把文件内容返回；
  - 其他则作为普通字符窜返回。
3. 如果`respondWith`取值为`Function`，则调用该函数。

### `respondWith`取值—普通字符串
respondWith可以取值字符串，此时作为text/plain格式字符串返回的。
修改ymockcfg.js：
```js
module.exports = [
	{
		test: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'hi ymock!'
	}
];
```
### `respondWith`取值—JSON文件字符串
如果字符串以".json"结尾则认为是相对于当前目录的JSON文件。如【快速开始】举例。

### `respondWith`取值—mockjson文件字符串
如果字符串以".mockjson"结尾则认为是相对于当前目录的MockJSON文件。
继续上面的举例（此时要mock 5条用户数据的列表），在data目录添加userlist.mockjson文件（[mockJSON语法](http://mockjs.com/)）：
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
```js
module.exports = [
	{
		test: function(req){
			// 你的逻辑
			return ~req.url.indexOf('user.json');	
		},
		respondWith: 'hi ymock!'
	},
	{
		test: /userlist\.json/,
		respondWith: 'data/userlist.mockjson' // 返回mockjson文件
	}
];
```
在浏览器中访问http://127.0.0.1:8080/userlist.json，会发现生产5跳数据。

### `respondWith`取值—函数
如果你想更加自由的控制mock的数据，那就给`respondWith`赋值个函数吧。此时会把函数的返回值作为mock数据。不过你也可以不返回数据，直接在函数中操作`res`来确定返回值（本质是个中间件）。
先来个栗子(根据请求参数决定mock数据)。修改ymockcfg.js:
```js
module.exports = [
	{
		test: /user\.json/,
		respondWith: function(req, res){
			return {
				name: req.query.name
			}
		}
	}
];
```
访问http://127.0.0.1:8080/user.json?name=john，则输出：
```js
{ 
  name: "john"
}
```
根据请求中QueryString的参数不同，而输出的mock数据也不同。

#### `respondWith`函数的形参`(req, res, next)`
respondWidth的函数本质是个中间件，参数同中间件的形参。
- 请求对象（[http.IncomingMessage](http://nodejs.cn/doc/node/http.html#http_class_http_incomingmessage)）
实参`req`会挂载两个属性[`req.query`](https://expressjs.com/en/4x/api.html#req.query)和[`req.body`](https://expressjs.com/en/4x/api.html#req.body)。
- 响应对象（[http.ServerResponse](http://nodejs.cn/doc/node/http.html#http_class_http_serverresponse)）
利用实参`res`可以自定义响应数据。

#### `respondWith`函数返回值
返回值如果返回值是以".json"或者".mockjson"结尾的字符串，则视为相对于当前目录的JSON文件，
```js
module.exports = [
	{
		test: /user\.json/,
		respondWith: function(){
			return 'data/user.json'; // 返回json文件名称字符串
		}
	}
];
```
同理如果以”.mockjson"结尾的字符串则视为相对于当前目录的mockjson文件：
```js
module.exports = [
	{
		test: /user\.json/,
		respondWith: function(){
			return 'data/userlist.mockjson';
		}
	}
];
```

### 支持异步
支持`respondWith`是个异步函数，可以用来模拟接口耗时等。
```js
module.exports = [
	{
		test: /user\.json/,
		respondWith: function(req, res){
			return new Promise(resolve => {
        setTimeout(() => {
          resolve('data/userlist.mockjson');
        }, 2000)
      })
		}
	}
];
```

# ymock命令介绍
执行命令可以查看ymock命令的帮助：
```sh
$ ymock -h
```
## init
执行下面命令查看init子命令的帮助
```sh
$ ymock init -h
```

## run -p [port]
执行下面命令查看run子命令的帮助
```sh
$ ymock run -h
```

# 结束语
如果你有兴趣欢迎添砖加瓦！
