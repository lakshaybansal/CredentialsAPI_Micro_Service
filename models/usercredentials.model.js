var Q = require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var UserCredentialsSchema = new Schema({
    username: String,
    password: String,
    admin: Boolean
});


UserCredentialsSchema.statics.authenticate = function(credentials) {
    var deferred = Q.defer();
    this.findOne({username: credentials.username}, function (err, data) {
        if (err) {
            deferred.reject({status: false, reason: error})
        }
        else if (!data || data == null) {
            deferred.reject({status: false, reason: 'user not found'})
        }
        else if (credentials.password != data.password) {
            deferred.reject({status: false, reason: 'wrong password'})
        }
        deferred.resolve({status: true})
    });

    return deferred.promise;
};

// NOTE: Not Required.
// UserCredentialsSchema.statics.register = function(credentials) {
//     var deferred = Q.defer();

//     this.create(credentials,function (err) {
//         if (err) {
//             deferred.reject();
//         } else {
//             deferred.resolve();
//         }
//     });

//     return deferred.promise;
// };

module.exports = mongoose.model('UserCredential', UserCredentialsSchema,'UserCredentials');