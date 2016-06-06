var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.json'); // get our config file

var app = express();

mongoose.connect(config.database);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connected");
});

app.use(logger('dev'));
app.use(bodyParser.json());
// secret variable

app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use('/credentials', require('./routes/credentials.api.js'));



module.exports = app;
