var jwt=require('jsonwebtoken');
var Q=require('q');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports

var UserCredentialsSchema=new Schema({
    name: String,
    password: String,
    admin: Boolean
});
var UserCredentials= mongoose.model('UserCredentials',UserCredentialsSchema);

module.exports=UserCredentials;

UserCredentialsSchema.statics.authenticate=function authenticate(UserCredential){
    var deferred = Q.defer();

    UserCredentials.findOne({
      name: UserCredential.name
    }, function(err, usercredentials) {

      if (err) throw err;

      if (!usercredentials) {
        console.log("Not found");
        deferred.resolve({ success: false, message: 'Authentication failed. User not found.' });
      } else if (usercredentials) {
        console.log("username found");
        // check if password matches
        if (usercredentials.password !=UserCredential.password) {
          console.log(" password not found");
          deferred.resolve({ success: false, message: 'Authentication failed. Wrong password.' });
        } else {

          // if user is found and password is right

          deferred.resolve({
            success: true,
          });
        }
      }
    });
 return deferred.promise;
}
 UserCredentialsSchema.statics.register=function register(UserCredential)
 {
   var deferred=Q.defer();
   var record=new UserCredentials(UserCredential);
	record.save(function(err) {
		if (err) throw err;
		console.log('User saved successfully');
		deferred.resolve({ success: true });
	});

return deferred.promise;
 }
