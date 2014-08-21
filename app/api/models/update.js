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
var formidable = require('formidable');

module.exports = {
	execute:function(params, cb){
		var _this = this;
		var model = {};
		var fullBody = '';
		var uploadedFiles = [];

		var form = new formidable.IncomingForm();

		form.parse(_this.app.request, function(err, fields, files) {
			if(params.putfileId && params.putfileId.match(/^[\w\-. ]+$/)) {
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
							var fileData = model = JSON.parse(data);
							fileData.content = fields.fileData;
							fileData.description = fields.description;

							if(fields.name && params.putfileId !== fields.name){
								fs.unlink(pathname);
								pathname = path + '../../../../' + 'private/uploads/' + fields.name + '.json';
								fileData.fileId = fields.name;
							}

							if(fileData.manualFile){
								fs.writeFile(pathname, JSON.stringify(fileData, null, 4), function(err) {
									cb({
										view:'read',
										fileData:fileData
									});

								});
							}else{

								if(files && files.file){
									var temp_path = files.file.path; //this.openedFiles[0].path;
									//The file name of the uploaded file
									var file_name = files.file.name; //this.openedFiles[0].name;
									//Location where we want to copy the uploaded file
									var new_location = path + '../../../../' + 'private/files/';

									fs.readFile(temp_path, function (err, data) {
										fs.writeFile(new_location + file_name, data, function(err){
											cb({
												view:'read',
												fileData:fileData
											});
										});
									});

								}
							}
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

//		form.on('end', function(fields, files) {}

	}
};