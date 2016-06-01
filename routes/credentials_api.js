var apiRoutes = express.Router();
var UserCredentials   = require('./app/models/usercredentials.model');
var jwt    = require('jsonwebtoken'); // used to create, sign, and verify tokens
var config = require('./config'); // get our config file

apiRoutes.set('superSecret', config.secret);

apiRoutes.post('/authenticate', function(req, res) {
	

	});
});
module.exports=apiRoutes;
