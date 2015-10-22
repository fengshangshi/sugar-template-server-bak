/**
 * @file 日志记录
 * @author fengshangshi
 */
var winston = require('winston');
var moment = require('moment');
var fs = require('fs');

// 建立日志目录
var log = logDir + '/app';
fs.existsSync(log) || fs.mkdirSync(log);

module.exports = new winston.Logger({
	transports: [
		new winston.transports.File({
			name: 'log',
			level: 'info',
			filename: log + '/app_' + moment().format('YYYYMMDD') + '.log'
		})
	]
});
