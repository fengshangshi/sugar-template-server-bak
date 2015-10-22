/**
 * sugarjs框架入口
 * @author fengshangshi
 */
global.sugar = global.S = {};
global.root = __dirname;

// sugarjs加载器
var loader = require('sugar-loader');
var assembler = require('sugar-assembler');

// 设置配置信息
var config = S.config = {};
var configs = loader.load('./conf');
assembler.assemble(configs, config);
assembler.assemble(S.config['global'], S);

// 设置全局目录变量
var _ = require('underscore');
var dirs = S.config['global']['dirs'];
_.each(dirs, function(v, k, list) {
	list[k] = root + v;
});
assembler.assemble(dirs, global);

// 设置lib
var libs = loader.load('./lib/framework');
assembler.assemble(libs, global);

// 进程事件监听
process.on('uncaughtException', function(err) {
	logger.error(S.name + '未捕获的错误 ' + (err.stack || err));
});

process.on('exit', function() {
	logger.error(S.name + '已经退出');
});

process.on('SIGINT', function() {
	logger.error(S.name + '收到退出信号，退出成功');
	process.exit(0);
});

// 加载服务器
var server = libDir + '/server';
server = require(server);
server.listen(S.framework['port'], function() {
	logger.info(S.name + '启动成功，工作端口' + S.framework['port']);
});
