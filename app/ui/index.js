/**
 * Node.js File Upload Example
 *
 * /app/ui/index.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
module.exports = {
	run:function(request, response, pathname){
		response.end('UI path called: ' + pathname);
	}
};