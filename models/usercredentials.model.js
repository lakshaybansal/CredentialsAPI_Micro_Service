var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// set up a mongoose model and pass it using module.exports
var UserCredentials= mongoose.model('UserCredentials', new Schema({
    name: String,
    password: String,
    admin: Boolean
}));

var services = {};
services.authentication = credentials_authenticate;
services.register=register;

module.exports=services;

function credentials_authenticate(UserCredentials){

UserCredentials.findOne({
  name: UserCredentials.name
}, function(err, usercredentials) {

  if (err) throw err;

  if (!usercredentials) {
    res.json({ success: false, message: 'Authentication failed. User not found.' });
  } else if (user) {

    // check if password matches
    if (usercredentials.password != req.body.password) {
      res.json({ success: false, message: 'Authentication failed. Wrong password.' });
    } else {

      // if user is found and password is right
      // create a token
      var token = jwt.sign(usercredentials, app.get('superSecret'), {
        expiresIn: 86400 // expires in 24 hours
      });

      res.json({
        success: true,
        message: 'Enjoy your token!',
        token: token
      });
    }
   }

});
