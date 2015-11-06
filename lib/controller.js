/**
 * @file 业务逻辑控制器
 * @description 加载所有app下的代码，自动路由化
 * @author fengshangshi
 */
var fs = require('fs');
var rd = require('rd');
var _ = require('underscore');

// 路由配置，自动加载生成
var ROUTEMAPPING = [];

// HTTP 方法
var HTTPMETHODS = [
	'GET', 'POST', 'PUT', 'DELETE', 'HEAD'
];

var _boot = function(app, root) {
	var file = root + '/index.js';
	if (!fs.existsSync(file)) return false;

	var entry = require(file);
	var conf = entry['config'];

	_.each(entry, function(v, k, list) {
		var path = root.split(/\/action/)[1];
		path = path === '' ? '/' : path;

		var configs = conf ? conf[k] : {}, 
			url, fn;

		if (configs && (url = configs['url'])) {
			var temp = path === '/' ? '' : path;
			path = configs['auto'] === false ? url : (temp + url);
		}

		url = path;
		fn = v;

		if (typeof fn === 'function') {
			ROUTEMAPPING.push({url: url, method: k});
			app[k](url, fn);
		}
	});
};

exports.boot = function(app) {
	var root = appDir + '/action';
	var dirs = rd.readDirSync(root);

	dirs.forEach(function(dir) {
		_boot(app, dir);
	});

	// 路由查询接口
	app.get('/all_available_uri', function(req, res) {
		res.json(ROUTEMAPPING);
	});
};
