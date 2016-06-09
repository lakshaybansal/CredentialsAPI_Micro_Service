var express = require('express');
var cors = require('cors')
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config.json'); // get our config file

var app = express();
//app.use(cors())
app.use(function (req, res, next) {
   res.header("Access-Control-Allow-Origin", "http://localhost:63342");
   res.header('Access-Control-Allow-Credentials', true);
   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   next();
});

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
