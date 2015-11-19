var config = {
	dbpath: "data.db",
	createThemeTba: "CREATE TABLE IF NOT EXISTS theme(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"info TEXT NOT NULL," +
		"date NOT NULL DEFAULT (datetime('now','localtime')))",
	createFilesTba: "CREATE TABLE IF NOT EXISTS files(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"sid INTEGER REFERENCES theme(id) ON UPDATE CASCADE," +
		"type TEXT NOT NULL," +
		"path TEXT NOT NULL)",
	insertTheme: "INSERT INTO theme(info)VALUES(?)",
	selectTheme: "SELECT * FROM theme",
	insertFilse: "INSERT INTO files(sid,type,path)VALUES(?,?,?)",
	selectFiles: "SELECT * FROM files where id=?"
}
module.exports = config;
