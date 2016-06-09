var express = require('express');
var apiRoutes = express.Router();
var userCredential = require('../models/userCredentials.model.js');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var request = require("request");
var Q = require('q');

var superSecret = config.secret;
var profile_API_address = config.api.profileAPI;

apiRoutes.post('/authenticate', function (req, res) {
   userCredential.authenticate(req.body).then(function (response) {
      getProfile(req.body.username).then(function (data) {
         res.send(data);
      }).catch(function () {
         res.send({status: false, reason: 'Error is Fetching Profile'});
      });
   }).catch(function (response) {
      res.send(response);
   });
});

function getProfile(username) {
   var deferred = Q.defer();
   request(profile_API_address + username, function (error, response, body) {

      if (error) {
         deferred.reject()
      }
      else if (body == 'null') {
         deferred.reject();
      }
      else if (response.statusCode == 404) {
         deferred.reject();
      }
      else if (!error && response.statusCode == 200 && body != null) {
         var data = JSON.parse(body);
         var userObj = {
            username: username,
            band: data.band,
            work_experience_in_year: data.work_experience_in_year,
            country_code: data.country_code,
            country: data.country,
            preferred_location: data.preferred_location
         };
         genrateJWT(userObj).then(function (token) {
            deferred.resolve(token);
         });

      }
   });
   return deferred.promise;
}

function genrateJWT(obj) {
   var deferred = Q.defer();
   var token = jwt.sign(obj, superSecret, {
      expiresInMinutes: 60 * 120  // expires in 120 Minutes
   });

   deferred.resolve(token);

   return deferred.promise;
}

apiRoutes.post('/register', function (req, res, next) {
   userCredential.register(req.body).then(function () {
      res.sendStatus(200);
   }).catch(function () {
      res.sendStatus(400);
   });
});

apiRoutes.get('/verifyToken', function (req, res, next) {
   var token = req.cookies.token;
   if (token) {
      fetchToken(token).then(function () {
         res.send({status: true});
      }).catch(function () {
         res.send({status: false});
      });
   } else {
      res.send({status: false});
   }
});

apiRoutes.get('/decodeToken', function (req, res, next) {
   var token = req.cookies.token;
   if (token) {
      fetchToken(token).then(function (obj) {
         res.send({object: obj});
      }).catch(function () {
         res.send({status: false});
      });
   } else {
      return res.send({
         status: false,
         message: 'No token provided.'
      });

   }

});

function fetchToken(token) {
   var deferred = Q.defer();
   jwt.verify(token, superSecret, function (err, decoded) {
      if (err) {
         deferred.reject({status: false, message: 'Failed to authenticate token.'});
      } else {
         deferred.resolve(decoded);
      }
   });
   return deferred.promise;
}

module.exports = apiRoutes;