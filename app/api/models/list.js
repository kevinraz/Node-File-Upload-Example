/**
 * Node.js File Upload Example
 *
 * /app/api/models/list.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
module.exports = {
	execute:function(params){
		return [{
			hello:'world' + params.getfileId
		}];
	}
};