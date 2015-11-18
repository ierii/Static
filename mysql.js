var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('static.db');
var config = {
	buildThemeTba: "CREATE TABLE IF NOT EXISTS  theme(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"info TEXT NOT NULL," +
		"date NOT NULL DEFAULT (datetime('now','localtime')))",
	buildFilesTba: "CREATE TABLE IF NOT EXISTS files(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"sid INTEGER REFERENCES theme(id) ON UPDATE CASCADE," +
		"type TEXT NOT NULL,"+
		"path TEXT NOT NULL)",
	insertTheme:"INSERT INTO theme(info)VALUES(?)",
	selectTheme:"SELECT * FROM theme",
	insertFilse:"INSERT INTO files(sid,type,path)VALUES(?,?,?)",
	selectFiles:"SELECT * FROM files where id=?"
}
db.serialize(function () {
	db.run(config.buildThemeTba);
	db.run(config.buildFilesTba);
	console.log('build ok!');
	var stmt=db.prepare(config.insertTheme);
	for(var i=0;i<10;i++){
		stmt.run("数据为："+i);
	}
	stmt.finalize();
	db.each(config.selectTheme,function(err,row){
		if(err){
			console.log('have err',err);
			return;
		}
		console.log(row);
	});

});

db.close();
