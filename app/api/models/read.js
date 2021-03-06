/**
 * Node.js File Upload Example
 *
 * /app/api/models/read.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
var fs = require('fs');
var path = __dirname;
var _ = require('lodash');
module.exports = {
	execute:function(params, cb){
		fs.readFile(path + '../../../../' + 'private/uploads/' + params.getfileId + '.json', 'utf8', function (err, data) {
			if (err) {
				console.log('Error: ' + err);
				return;
			}
			cb({
				view:'read',
				fileData:JSON.parse(data)
			});
		});
	}
};