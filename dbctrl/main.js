var config = require('../config/dbconfig.js');
var sqlite3 = require('sqlite3').verbose();
var prepare = {}
var db = new sqlite3.Database(config.dbpath, function (err) {
	if (err) {
		return log('数据库打开失败！', err);
	}
	db.serialize(function () {
		db.run(config.createThemeTba);
		db.run(config.createFilesTba);
	});
	log('数据库初始化成功！');
});

function log(info, result) {
	console.log(info, result);
}
var dbctrl = {
	insertTheme: function (data, handle) {
		db.run(config.insertTheme, data, function (err) {
			if (err) return console.log('插入主题出错！', err);
			db.get(config.selectThemeOne, {
				$fpath: data.$fpath
			}, function (err, row) {
				handle(err, row)
			});
		});
	},
	selectTheme: function (handle) {
		db.all(config.selectTheme, function (err, row) {
			handle(err, row);
		});
	},
	deleteTheme: function (data, handle) {
		db.run(config.deleteThemeFiles, data, function (err) {
			if (err) {
				return handle(err);
			}
			db.run(config.deleteTheme, data, function (err) {
				handle(err);
			})
		});

	},
	insertFiles: function (data, handle) {
		db.run(config.insertFiles, data, function (err) {
			handle(err)
		});
	},
	selectFiles: function (data, handle) {
		db.all(config.selectFiles, data, function (err, row) {
			handle(err, row);
		});
	},
	selectFile:function(data,handle){
		db.get(config.selectFile,data,function(err,row){
			handle(err,row);
		});
	},
	deleteFile: function (data, handle) {
		db.run(config.deleteFile, data, function (err) {
			handle(err);
		});
	},
	closeDB: function () {
		db.close();
		log('关闭数据库......', '');
	}
};
module.exports = dbctrl;
