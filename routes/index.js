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
	if (id && fpath) {
		filectrl.deletePath(fpath,function(){
			dbctrl.deleteTheme({
				$id:id
			},function(err){
				if(err)return res.send({err:err});
				Eventer.emit('buildMain');
				res.send({err:null});
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
	var sid=req.query.sid,
		id=req.query.id,
		path=req.query.path;
		data=null;
		if(!(sid||(id&&path)))return console.log('没有查询参数');
		if(sid){
			data={
				$sid:sid
			};
			dbctrl.selectFiles(data,function(err,row){
				if(err)return console.log('查询文件列表出错',err);
				res.send(row);
			});
		}
		if(id&&path){
			filectrl.deletePath(path,function(){
				dbctrl.deleteFile({$id:id},function(err){
					if(err) return res.send({err:err});
					var data={
						sid:id,
						path:path.replace(/\/[^\/]+(\.\w+)$/g,'')

					}
					Eventer.emit('buildFiles',data);
					res.send({err:null});
				});
			});
		}
}).post(function (req, res) {
	filectrl.uploadFiles(req,function(err,data){
		if(err)return console.log('文件上传出错！',err);
		dbctrl.insertFiles({
			$sid:data.sid,
			$type:data.type,
			$mark:data.mark,
			$path:data.fpath
		},function(err){
			if(err)return console.log('文件数据插入出错！',err);
			dbctrl.selectFile({$mark:data.mark},function(err,row){
				if(err)return console.log('查询文件数据插入出错！',err);
				Eventer.emit('buildFiles',data);
				res.send(row);
			});
		})
	});
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
			path: "public/database/",
			fileName: buildconfig.mainFName,
			fileObj: row
		}
		filectrl.makeFile(data, function (filepath) {
			console.log('生成文件成功：', filepath);
		});
	});
});
Eventer.on('buildFiles',function(data){
	console.log('build the Files',data);
	dbctrl.selectFiles({$sid:data.sid},function(err,row){
		if(err)console.log('查询文件列表出错？',err);
		var ndata={
			path:data.path,
			fileName:buildconfig.menuFName,
			fileObj:row
		};
		filectrl.makeFile(ndata,function(filepath){
			console.log('生成文件成功：', filepath);
		});
	});
});
module.exports = app;
