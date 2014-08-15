/**
 * Node.js File Upload Example
 *
 * /app/api/index.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
module.exports = {
	run:function(request, response, pathname){
		response.end('API path called: ' + pathname);
	}
};