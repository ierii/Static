var dbctrl = require('../dbctrl/main.js');
var filectrl = require('../filectrl/main.js');
var buildconfig = require('../config/buildconfig.js');
var events = require('events');
var express = require('express');
var Eventer = new events.EventEmitter();
var app = express();
app.get('/', function (req, res, next) {
	console.log('get home page');
	res.sendfile('public/build.html');
});
/*主题项目列表的操作*/
app.route('/theme').get(function (req, res) {
	var id = req.query.id,
		fpath = req.query.fpath;
	console.log(id,fpath);
	if (id && fpath) {
		filectrl.deletePath(fpath,function(){
			dbctrl.deleteTheme({
				$id:id
			},function(err){
				res.send({err:err});
			});
		});
	} else {
		getMain(function (row) {
			res.send(row);
		});
	}
}).post(function (req, res) {
	filectrl.makeDir(+new Date(), function (filepath) {
		var data = {
			$info: req.body.info,
			$fpath: filepath
		};
		dbctrl.insertTheme(data, function (err, row) {
			if (err) {
				return console.log('插入数据出错', err);
			}
			Eventer.emit('buildMain');
			res.send(row);
		});
	});
});
/*文件目录的操作*/
app.route('/files').get(function (req, res) {
	res.sendfile('public/test.html');
}).post(function (req, res) {
	filectrl.uploadFiles(req,function(err,data){
		if(err){
			console.log('文件上传出错！',err);
		}
		console.log('the upload files:',data);
	});
	res.send(200);
});


function getMain(handle) {
	dbctrl.selectTheme(function (err, row) {
		if (err) return console.log('查询主题出错！', err);
		handle(row)
	});
};
Eventer.on('buildMain', function (data) {
	console.log('build the menu');
	getMain(function (row) {
		var data = {
			path: "",
			fileName: buildconfig.mainFName,
			fileObj: row
		}
		filectrl.makeFile(data, function (filepath) {
			console.log('生成文件成功：', filepath);
		});
	});
});
module.exports = app;
