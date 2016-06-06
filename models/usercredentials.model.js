var jwt = require('jsonwebtoken');
var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var UserCredentialsSchema = new Schema({
    username: String,
    password: String,
    admin: Boolean
});

var services = {};

services.authenticate = authenticate;
services.register = register;

var UserCredentials = mongoose.model('UserCredentials', UserCredentialsSchema);

module.exports = services;

function authenticate(credentials) {
    var deferred = Q.defer();

    UserCredentials.findOne({username: credentials.username}, function (err, data) {

        if (err) {
            deferred.reject({status: false, reason: error})
        }
        if (!data || data.length == 0) {
            deferred.reject({status: false, reason: 'user not found'})
        }
        if (credentials.password != data.password) {
            deferred.reject({status: false, reason: 'wrong password'})
        }
        deferred.resolve({status: true})
    });

    return deferred.promise;
};

function register(credentials) {
    var deferred = Q.defer();

    var record = new UserCredentials(credentials);
    record.save(function (err) {
        if (err) {
            deferred.reject();
        } else {
            deferred.resolve();
        }
    });

    return deferred.promise;
};