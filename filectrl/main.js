var fconfig = require('../config/fileconfig.js');
var multiparty = require('multiparty');
var fs = require('fs');
var defile = DeFile();
var filectrl = {
    /*生成目录用的*/
    makeDir: function(foldername, handle) {
        var realPName = fconfig.path + foldername;
        if (!fs.existsSync(realPName)) {
            fs.mkdirSync(realPName);
        }
        handle(realPName);
    },
    /*生成json文件用的*/
    makeFile: function(data, handle) {
        var realPath = data.path,
            outputFilename = realPath + '/' + data.fileName;
        if (!fs.existsSync(realPath)) return console.log('路径不存在！');
        fs.writeFile(outputFilename, JSON.stringify(data.fileObj, null, 4), function(err) {
            if (err) return console.log('生成：' + outputFilename + '出错');
            handle(outputFilename);
        });
    },
    /*删除文件-夹*/
    deletePath: function(path, handle) {
        var realPath = path;
        if (!fs.existsSync(realPath)) return console.log('删除的文件不存在！');;
        if (fs.statSync(realPath).isDirectory()) {
            var filesList = fs.readdirSync(realPath);
            if (filesList.length != 0) {
                filesList.forEach(function(fileName) {
                    fs.unlinkSync(realPath + '/' + fileName);
                });
            }
            fs.rmdirSync(realPath);
        } else {
            fs.unlinkSync(realPath);
        }
        handle();
    },
    uploadFiles: function(req, handle) {
        var form = new multiparty.Form({
            uploadDir: fconfig.filesTemp
        });
        form.parse(req, function(err, fields, files) {
            if (err) {
                return handle(err);
            }
           /* console.log('fields:', fields);
            console.log('files:', files);*/
            var item = files.files[0],
                sid = fields.id[0],
                realPath = fields.fpath[0],
                data = null,
                realPName = realPath + '/' + item.originalFilename;
            console.log('目标目录：', realPName);
            data = {
                sid: sid,
                type: defile.getFileType(realPName),
                mark: +new Date(),
                fpath: realPName,
                path: realPath
            }
            fs.rename(item.path, realPName, function(err) {
                if (err) {
                    return handle(err)
                }
                handle(null, data)
            });
        });

    }
};

function DeFile() {
    var img = {
        ".png": true,
        ".jpg": true,
        ".gif": true,
        ".svg": true,
        ".bmp": true,
        ".jpeg": true,
        ".apng": true
    };
    var ret = {
        getSuffix: function(filename) {
            var suffix = /\.[^\.]+/.exec(filename);
            return suffix[0].toLowerCase();
        },
        getFileType: function(filename) {
            var suffix = ret.getSuffix(filename);
            return img[suffix] ? 'img' : 'other';
        }
    }
    return ret;
}
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
