const request = require('request');
const Q = require('q');
const jwt = require('jsonwebtoken');
var config = require('../config');
var profile_API_address = config.api.profileAPI;
var superSecret = config.secret;


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
            band: data.result.band,
            work_experience_in_year: data.result.work_experience_in_year,
            country_code: data.result.country_code,
            country: data.result.country,
            preferred_location: data.result.preferred_location,
            organisation_name: data.result.organisation_name
         };
         generateToken(userObj).then(function (token) {
            deferred.resolve(token);
         });

      }
   });
   return deferred.promise;
}

function generateToken(obj) {
   var deferred = Q.defer();
   var token = jwt.sign(obj, superSecret, {
      expiresIn: 60 * 1200  // expires in 120 Minutes
   });

   deferred.resolve(token);

   return deferred.promise;
}


function verifyToken(token) {
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


module.exports = {
  getProfile: getProfile,
  generateToken: generateToken,
  verifyToken: verifyToken
};