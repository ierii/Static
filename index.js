var express = require('express'),
	path = require('path');
var port = process.env.VCAP_APP_PORT || 3000;
var routes=require('./routes/index');
var app = express();
app.listen(port,function(){
	console.log('the sever run in the localhost:'+port);
});
/*设置模板引擎*/
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', routes);


app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});
module.exports = app;
