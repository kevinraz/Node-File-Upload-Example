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
		return require('../models/list.js').execute.call(this, params, cb);
	},
	create:function(params, cb){
		return require('../models/create.js').execute.call(this, params, cb);
	},
	read:function(params, cb){
		return require('../models/read.js').execute.call(this, params, cb);
	},
	update:function(params, cb){
		return require('../models/update.js').execute.call(this, params, cb);
	},
	delete:function(params, cb){
		return require('../models/delete.js').execute.call(this, params, cb);
	},
	readData:function(params, cb){
		return require('../models/readData.js').execute.call(this, params, cb);
	},
	downloadData:function(params, cb){
		return require('../models/downloadData.js').execute.call(this, params, cb);
	}
};