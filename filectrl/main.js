var fconfig = require('../config/fileconfig.js');
var fs = require('fs');
var filectrl = {
	/*生成目录用的*/
	makeDir: function (foldername, handle) {
		var realPName = fconfig.path + foldername;
		if (!fs.existsSync(realPName)) {
			fs.mkdirSync(realPName);
		}
		handle(realPName);
	},
	/*生成json文件用的*/
	makeFile: function (data, handle) {
		var realPath = fconfig.path + data.path,
			outputFilename = realPath + '/' + data.fileName;
		if (!fs.existsSync(realPath)) return console.log('路径不存在！');
		fs.writeFile(outputFilename, JSON.stringify(data.fileObj, null, 4), function (err) {
			if (err) return console.log('生成：' + outputFilename + '出错');
			handle(outputFilename);
		});
	},
	/*删除文件-夹*/
	deletePath: function (path, handle) {
		var realPath=path;
		if (!fs.existsSync(realPath)) return console.log('删除的文件不存在！');;
		if (fs.statSync(realPath).isDirectory()) {
			var filesList = fs.readdirSync(realPath);
			if (filesList.length != 0) {
				filesList.forEach(function (fileName) {
					fs.unlinkSync(realPath + '/' + fileName);
				});
			}
			fs.rmdirSync(realPath);
		} else {
			fs.unlinkSync(realPath);
		}
		handle();
	}
};
/*var data = {
	path: "biubiu",
	fileName: 'biubiu.json',
	fileObj: {
		name: 'nan',
		age: 22,
		sex: "M"
	}
}
filectrl.makedir('biubiu', function () {
	console.log('建立文件成功');
	filectrl.makeFile(data, function (filepath) {
		console.log('文件新建成功', filepath);
		filectrl.deletePath('biubiu', function () {
			console.log('删除文件夹成功');
		});
	});
});*/

module.exports = filectrl;
