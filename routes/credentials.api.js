var express = require('express');
var apiRoutes = express.Router();
var userCredential = require('../models/usercredentials.model');
var jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('../config'); // get our config file
var request = require("request");
var Q = require('q');

var superSecret = config.secret;

apiRoutes.post('/authenticate', function (req, res) {
    userCredential.authenticate(req.body).then(function (response) {
        getProfile(req.body.username).then(function (data) {
            res.send(data);
        }).catch(function () {
            res.sendStatus(400);
        });
    }).catch(function (response) {
        res.sendStatus(400);
    })
});

function getProfile(username) {
    var deferred = Q.defer();
    request("http://172.23.238.164:3040/api/userEntity/" + username, function (error, response, body) {
        if (error) {
            deferred.reject()
        }
        else if (body == 'null') {
            deferred.reject();
        }
        else if (response.statusCode == 400) {
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
    var token = jwt.sign(obj, 'vinitKumar', {
        expiresIn: 86400 // expires in 24 hours
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

apiRoutes.post('/verifytoken', function (req, res, next) {
    var token = req.body.token || req.params('token') || req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, superSecret, function (err, decoded) {
            if (err) {
                return res.json({success: false, message: 'Failed to authenticate token.'});
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
apiRoutes.use(function (req, res) {
    var token = jwt.sign(req.body, superSecret, {
        expiresIn: 86400 // expires in 24 hours
    });
    res.send(token);
});

module.exports = apiRoutes;
