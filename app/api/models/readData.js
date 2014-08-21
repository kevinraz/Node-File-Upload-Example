/**
 * Node.js File Upload Example
 *
 * /app/api/models/readData.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
var fs = require('fs');
var path = __dirname;
var mime = require('mime');
var _ = require('lodash');
var PATH = require('path');
module.exports = {
	execute:function(params, cb){
		var _this = this;
		fs.readFile(PATH.normalize(path + '../../../../' + 'private/uploads/' + params.getfileId + '.json'), 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			var fileData = JSON.parse(data);
			if(_this.app.request.headers.async === "true"){
				cb({
					fileData:fileData,
					view:'readData'
				}, {
					contentType:mime.lookup(fileData.fileId)
				});
			}else{
				_this.app.response.setHeader('Content-disposition', 'attachment; filename=' + fileData.fileId);
				_this.app.response.setHeader('Content-type', fileData['Content-Type']);
				if(fileData.manualFile){
					_this.app.response.end(fileData.content);
				}else if(fileData.fileName){
					var filestream = fs.createReadStream(PATH.normalize(path + '../../../../' + 'private/files/' +fileData.fileId));
					filestream.pipe(_this.app.response);
					filestream.on('end', function(){
						_this.app.response.end();
					});
				}
				return false;
			}
		});
	}
};