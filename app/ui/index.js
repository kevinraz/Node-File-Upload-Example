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
var fs = require('fs');
var PATH = require('path');
module.exports = {
	run:function(request, response, pathname){
		pathname = pathname;
		if (fs.statSync(pathname).isDirectory()) {
			pathname = '/public/' + pathname.replace(/(\/)$/, '') + '/index.html';
		}
		fs.exists(pathname, function(exists) {

			if(!exists) {
				response.writeHead(404, {"Content-Type": "text/html"});
				response.write('404');
				response.end();
				return;
			}
			fs.readFile( pathname, "binary", function(err, file) {
				if(err) {
					response.writeHead(500, {"Content-Type": "text/plain"});
					response.write(err + "\n");
					response.end();
					return;
				}

				response.setHeader("Content-Type", mime.lookup(pathname)); //Solution!
				response.writeHead(200);
				response.write(file, "binary");
				response.end();
			});
		});

		//response.end('UI path called: ' + pathname);
	}
};