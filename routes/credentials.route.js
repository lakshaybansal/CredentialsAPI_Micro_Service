var express = require('express');
var router = express.Router();
var userCredential = require('../models/usercredentials.model.js');
var jwt = require('jsonwebtoken');
var config = require('../config');
var credentialHandler = require('./credentials.controller.js')
var superSecret = config.secret;


router.post('/authenticate', function (req, res) {
   userCredential.authenticate(req.body).then(function (response) {
        console.log(req.body);
      credentialHandler.getProfile(req.body.username).then(function (data) {
         res.send(data);
      }).catch(function () {
         res.send({status: false, reason: 'Error is Fetching Profile'});
      });
   }).catch(function (response) {
      res.send(response);
   });
});

router.get('/verifyToken', function (req, res, next) {
   var token = req.cookies.token || req.headers['x-access-token'];
   console.log(req.cookies)
   if (token) {
      credentialHandler.verifyToken(token).then(function () {
         res.send({status: true});
      }).catch(function () {
         res.send({status: false});
      });
   } else {
      res.send({status: false});
   }
});

// NOTE: Not required now.
// router.post('/register', function (req, res, next) {
//    userCredential.register(req.body).then(function () {
//       res.sendStatus(200);
//    }).catch(function () {
//       res.sendStatus(400);
//    });
// });


router.get('/decodeToken', function (req, res, next) {
    var token = req.cookies.token || req.headers['x-access-token'];
   if (token) {
      credentialHandler.verifyToken(token).then(function (obj) {
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

module.exports = router;