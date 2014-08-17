/**
 * Node.js File Upload Example
 *
 * /app/api/models/update.js
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
			decodedBody.name = (decodedBody.name || '').replace(/%20| /g, '');
			if(params.putfileId && params.putfileId.match(/^[\w\-. ]+$/)){
				var pathname = path + '../../../../' + 'private/uploads/' + params.putfileId + '.json';
				fs.exists(pathname, function(exists) {
					if(!exists) {
						model = {
							error:['File does not exist.']
						};
					}else{
						fs.readFile(pathname, 'utf8', function (err, data) {
							if (err) {
								console.log('Error: ' + err);
								return;
							}
							var fileData = JSON.parse(data);
							fileData.content = decodedBody.fileData;
							fileData.description = decodedBody.description;

							if(decodedBody.name && params.putfileId !== decodedBody.name){
								fs.unlink(pathname);
								pathname = path + '../../../../' + 'private/uploads/' + decodedBody.name + '.json';
								fileData.fileId = decodedBody.name;
							}

							fs.writeFile(pathname, JSON.stringify(fileData, null, 4), function(err) {
								cb({
									view:'read',
									fileData:fileData
								});

							});
						});
					}
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