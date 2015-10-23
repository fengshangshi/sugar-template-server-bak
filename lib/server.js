/**
 * @file web server
 * @description 所有web服务器的业务逻辑
 * @author fengshangshi
 */
var express = require('express');
var morgan = require('morgan');
var hbs = require('hbs');

var fileStream = require('file-stream-rotator');
var header = require('connect-header');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var timeout = require('connect-timeout');

// 基于express
var app = module.exports = express();

// 设置访问日志
// 访问日志，是一个请求的开始，这里记录一个logid，后续方便运维追查
// 同一个请求的logid保证一致
var accessLogStream = fileStream.getStream({
	filename: logDir + '/access_%DATE%.log',
	date_format: 'YYYYMMDD',
	frequency: 'daily',
	verbose: false
});
app.use(morgan('combined', {
	stream: accessLogStream
}));

// 处理响应超时，默认10等待
var delay = S.delay || 10;
app.use(timeout(delay * 1000));
app.use(function(req, res, next) {
	// 记录日志，方便后续运维追查
	// 这里需要补充，增加记录哪些信息
	setTimeout(function() {
		if (req.timeout) {
			logger.error('响应超时');
		}
	}, (delay + 1) * 1000);
	next();
});


// 设置静态资源
var staticConfig = {
	dotfiles: 'ignore',
	etag: false,
	extensions: ['html', 'css', 'js', 'png', 'gif', 'jpg'],
	index: false,
	maxAge: 0,
	lastModified: false,
	redirect: true
};
app.use(express.static(staticDir, staticConfig));

// 设置模板引擎
app.set('views', viewDir);
app.set('view engine', 'html');
app.engine('html', hbs.__express);

// 重写express http头
app.set('x-powered-by', false);
app.use(header({
	'Server': S.framework['server'],
	'X-Powered-By': S.framework['support'] + '/' + S.version
}));

// 对请求进行格式化处理
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

// 初始化路由控制器
var controller = libDir + '/controller';
controller = require(controller);
controller.boot(app);

// 处理404
app.all('*', function(req, res) {
	res.status(404);
	res.send('对不起，服务器泡妞去了');
});
