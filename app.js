var express = require('express'),
	path = require('path'),
	bodyParser = require('body-parser');
var port = process.env.VCAP_APP_PORT || 3000;
var routes = require('./routes/index');
var app = express();
app.listen(port, function () {
	console.log('the sever run in the localhost:' + port);
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use('/', routes);
app.use('/theme', routes);

/*app.use(function (req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

if (app.get('env') === 'development') {
	app.use(function (err, req, res, next) {
		res.status(err.status || 500);
		console.log('have dev some err:', err);
	});
}

app.use(function (err, req, res, next) {
	res.status(err.status || 500);
	console.log('have some err:', err);
});*/
module.exports = app;
