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
	home:function(){
		return require('../models/list.js').execute();
	},

	readData:function(params){
		return require('../models/list.js').execute(params);
	}
};