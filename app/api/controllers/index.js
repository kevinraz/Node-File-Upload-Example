/**
 * Node.js File Upload Example
 *
 * /app/api/controllers/index.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
module.exports = {
	home:function(params, cb){
		return require('../models/list.js').execute(params, cb);
	},
	create:function(params, cb){},
	read:function(params, cb){
		return require('../models/read.js').execute(params, cb);
	},
	update:function(params, cb){},
	delete:function(params, cb){},

	readData:function(params, cb){
		return require('../models/readData.js').execute(params, cb);
	}
};