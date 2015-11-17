var express = require('express'),
	path = require('path');
var port = process.env.VCAP_APP_PORT || 3000;
var app = express();
app.listen(port,function(){
	console.log('the sever run in the localhost:'+port);
});
var routes=require('./routes/index');
/*设置静态文件托管目录*/
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/build', routes);

// 404错误处理
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/*开发者调试用的*/
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
		console.log('开发时发生一些错误，啥子呢？',err);
    });
}
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
	console.log('生产环境发生一些错误，啥子呢？',err);
});
module.exports = app;
