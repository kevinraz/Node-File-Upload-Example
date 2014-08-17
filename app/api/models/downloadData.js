/**
 * Node.js File Upload Example
 *
 * /app/api/models/downloadData.js
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
module.exports = {
	execute:function(params, cb){

		fs.readFile(path + '../../../../' + 'private/uploads/' + params.getfileId + '.json', 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			data = JSON.parse(data);
			cb((data.content || ''), {
				contentType:mime.lookup(data.fileId)
			});
		});
	}
};