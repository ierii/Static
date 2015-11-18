var CONFIG = require('../config/dbconfig.json');
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(CONFIG.dbpath),
	prepareInsetTheme = db.prepare(config.insertTheme),
	prepareSelectTheme = db.prepare(config.selectTheme),
	prepareInsetFiles = db.prepare(config.insertFilse),
	prepareSelectFiles = db.prepare(config.selectFiles);
var dbctrl = {
	init: function () {
		db.serialize(function () {
			db.run(config.createThemeTba);
			db.run(config.createFilesTba);

		});
		db.close();
	},
	insertTheme: function (data) {
		db.serialize(function () {
			prepareInsetTheme.run(data);
		});
		db.close();
	},
	selectTheme:function(data){
		db.serialize(function () {
			prepareInsetTheme.run(data,function(err,row){
				if(err){
					console.log('err:',err);
				}
				console.log(row);
			});
		});
		db.close();
	}
};
dbctrl.init();
dbctrl.insertTheme("数据啦");
//dbctrl.selectTheme();
module.exports=dbctrl;
