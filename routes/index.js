var express = require('express');
var app = express();
app.get('/', function (req, res, next) {
	res.sendfile('./public/index.html');
});
app.route('/build').get(function (req, res) {}).post(function (req, res) {});
module.exports = app;
