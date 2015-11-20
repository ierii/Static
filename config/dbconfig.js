var config = {
	/*数据库的储存位置,相对与根目录*/
	dbpath: "public/data/data.db",
	/*用于建立基础的数据表*/
	createThemeTba: "CREATE TABLE IF NOT EXISTS theme(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"info TEXT NOT NULL," +
		"fpath TEXT NOT NULL,"+
		"date NOT NULL DEFAULT (datetime('now','localtime')))",
	createFilesTba: "CREATE TABLE IF NOT EXISTS files(" +
		"id INTEGER PRIMARY KEY NOT NULL," +
		"sid INTEGER REFERENCES theme(id) ON UPDATE CASCADE," +
		"type TEXT NOT NULL," +
		"path TEXT NOT NULL)",
	/*主题表的基本操作*/
	insertTheme: "INSERT INTO theme(info,fpath)VALUES($info,$fpath)",
	selectTheme: "SELECT * FROM theme ORDER BY id DESC",
	selectThemeOne:"SELECT * FROM theme WHERE fpath=$fpath",
	deleteThemeFiles:"DELETE FROM files WHERE sid=$id",
	deleteTheme:"DELETE FROM theme WHERE id=$id",
	/*文件表的基本操作*/
	insertFiles: "INSERT INTO files(sid,type,path)VALUES($sid,$type,$path)",
	selectFiles: "SELECT * FROM files where sid=$sid",
	deleteFiles:"DELETE FROM  files WHERE id=$id"
}
module.exports = config;
