var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config/config'); // get our config file

var app = express();

mongoose.connect(config.database);

app.use(logger('dev'));
app.use(bodyParser.json());
// secret variable

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/credentials',require('./routes/credentials_api.js'));

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
