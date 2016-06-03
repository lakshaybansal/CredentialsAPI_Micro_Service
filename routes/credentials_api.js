
var express = require('express');
var apiRoutes = express.Router();
var UserCredentials  = require('../models/usercredentials.model');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config/config'); // get our config file

 var superSecret= config.secret;

apiRoutes.post('/authenticate', function(req, res,next) {
	console.log(UserCredentials);
	UserCredentials.schema.statics.authenticate(req.body).then(function(data){
	next();
	});
});

apiRoutes.post('/register', function(req, res,next) {
	console.log(UserCredentials);
	UserCredentials.schema.statics.register(req.body).then(function(data){
		console.log("user added successfully");
	  next();
	});
});
apiRoutes.post('/verifytoken',function(req,res,next)
{
	var token = req.body.token || req.params('token') || req.headers['x-access-token'];
		if (token) {

			jwt.verify(token,superSecret, function(err, decoded) {
				if (err) {
					return res.json({ success: false, message: 'Failed to authenticate token.' });
				} else {
					req.decoded = decoded;
				  res.send(req.decoded);
					//res.send("Hello");
				}
			});

		} else {
			return res.status(403).send({
				success: false,
				message: 'No token provided.'
			});

		}

});
apiRoutes.use(function(req,res){
	var token = jwt.sign(req.body, superSecret, {
		expiresIn: 86400 // expires in 24 hours
	});
   res.send(token);
});

module.exports=apiRoutes;
