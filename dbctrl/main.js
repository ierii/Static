var CONFIG = require('../config/dbconfig.js');
console.log(CONFIG);
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database(CONFIG.dbpath),
	prepareInsetTheme = db.prepare(CONFIG.insertTheme),
	prepareSelectTheme = db.prepare(CONFIG.selectTheme),
	prepareInsetFiles = db.prepare(CONFIG.insertFilse),
	prepareSelectFiles = db.prepare(CONFIG.selectFiles);
var log = {
	begin: function (info) {
		console.log('begin to:' + info);
	},
	end: function (info) {
		console.log('complete the:' + info);
	}
}
var dbctrl = {
	init: function () {
		db.serialize(function () {
			log.begin('create table');
			db.run(CONFIG.createThemeTba);
			db.run(CONFIG.createFilesTba);
		});
		db.close();
	},
};
dbctrl.init();
module.exports = dbctrl;
