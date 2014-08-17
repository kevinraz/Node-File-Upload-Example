/**
 * Node.js File Upload Example
 *
 * /app/api/models/create.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
var fs = require('fs');
var path = __dirname;
var _ = require('lodash');
var querystring = require('querystring');
var mime = require('mime');
module.exports = {
	execute:function(params, cb){
		var model = {};
		var fullBody = '';

		this.app.request.on('data', function(chunk) {
			fullBody += chunk.toString();
		});

		this.app.request.on('end', function() {
			// parse the received body data
			var decodedBody = querystring.parse(fullBody);

			if(decodedBody.name && decodedBody.name.match(/^[\w\-. ]+$/)){
				var pathname = path + '../../../../' + 'private/uploads/' + decodedBody.name + '.json';
				fs.exists(pathname, function(exists) {
					if(exists) {
						model = {
							error:['File already exists, please choose a different name.']
						};
					}else{
						var fileData = {
							fileId:decodedBody.name,
							created:new Date(),
							description:decodedBody.description,
							"Content-Type": mime.lookup(decodedBody.name)
						};
						fs.writeFile(pathname, JSON.stringify(fileData, null, 4), function(err) {
							if(err) {
								console.log(err);
							} else {
								console.log("JSON saved to " + pathname);
							}
						});
						model = {
							view:'createData',
							fileData:fileData
						};
					}
					cb(model);
				});
			}else{
				model = {
					error:['Invalid filename.']
				};
				cb(model);
			}
		});
	}
};