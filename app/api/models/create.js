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
var async = require('async');
var fs = require('fs');
var path = __dirname;
var _ = require('lodash');
var querystring = require('querystring');
var mime = require('mime');
module.exports = {
	execute:function(params, cb){
		var _this = this;
		var model = {};
		var fullBody = '';

		this.app.request.on('data', function(chunk) {
			fullBody += chunk.toString();
		});

		this.app.request.on('end', function() {
			// parse the received body data
			var decodedBody = querystring.parse(fullBody);
			if(decodedBody['filename[]']){
				// Uploaded local file
				if(!_.isArray(decodedBody['filename[]'])){
					saveFileObject({name:decodedBody['filename[]'], description:decodedBody['description[]']}, false, false,function(model){
						cb(model);
					});
				}else{
					model = {
						view:'createData',
						fileData:[]
					};
					var i = 0;
					async.eachSeries(decodedBody['filename[]'], function(filename, cb) {

						saveFileObject({name:filename, description:decodedBody['description[]'][i]}, false, true, function(fileModel){
							model.fileData.push( fileModel );
							cb && cb();
						});
						i++;
					},
					// Final callback after each item has been iterated over.
					function(err) {
						cb(model);
					});
				}

			}else{

				// Manually created file
				saveFileObject(decodedBody, true, false, function(model){
					cb(model);
				});
			}
		});

		var saveFileObject = function(fileObject, manualFile, dataOnly, cb){
			var fileModel;
			fileObject.name = fileObject.name.replace(/%20| /g, '');
			if(fileObject.name && fileObject.name.match(/^[\w\-. ]+$/)){
				var pathname = path + '../../../../' + 'private/uploads/' + fileObject.name + '.json';
				fs.exists(pathname, function(exists) {

					var fileData = {
						fileId:fileObject.name,
						fileName:manualFile ? '' : new Date().getTime(),
						manualFile:manualFile,
						created:new Date(),
						description:fileObject.description,
						"Content-Type": mime.lookup(fileObject.name)
					};
					if(dataOnly){
						fileModel = fileData;
					}else{
						fileModel = {
							view:'createData',
							fileData:fileData
						};
					}

					if(exists && !manualFile) {
						fs.readFile(pathname, 'utf8', function (err, data) {
							if (err) {
								console.log('Error: ' + err);
								return;
							}
							var fileData = JSON.parse(data);
							fileData.fileName = fileData.fileName;
							fs.writeFile(pathname, JSON.stringify(fileData, null, 4));
							cb( fileModel );
						});
					}else{
						fs.writeFile(pathname, JSON.stringify(fileData, null, 4));
						cb( fileModel );
					}



				});
			}else{
				cb({
					error:['Invalid filename.']
				});
			}

		}
	}
};