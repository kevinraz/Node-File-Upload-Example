/**
 * Node.js File Upload Example
 *
 * /app/api/models/list.js
 * Opens private file dir and outputs an array of file names.
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
		var model = {
			files:fs.readdirSync(path + '../../../../' + 'private/uploads/')
		};
		_.each(model.files, function(file, i){
			model.files[i] = file.replace(/(\.json)$/, '');
		});
		cb( model );
	}
};