var config = require('../config/dbconfig.js');
var sqlite3 = require('sqlite3').verbose();
var prepare = {}
var db = new sqlite3.Database(config.dbpath, function (err) {
	if (err) {
		console.log('打开或建立数据库失败！', err);
		return;
	}
	db.serialize(function () {
		db.run(config.createThemeTba);
		db.run(config.createFilesTba);
	});
	db.close();
	console.log('数据库初始化成功！');
});
var dbctrl = {
	insertTheme: function (data) {
		db.serialize(function () {
			var prepareInsertTheme = db.prepare(config.insertTheme);
			prepareInsertTheme.run(data,function(err){
				if(err){
					console.log('数据插入失败！',err);
					return;
				}
				console.log('数据插入成功！');
			});
			prepareInsertTheme.finalize();
		});
	},
	closeDB:function(){
		db.close();
		console.log('关闭数据库......');
	}
};
dbctrl.insertTheme('天空的大鱼');
module.exports = dbctrl;
