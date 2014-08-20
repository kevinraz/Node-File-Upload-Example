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
var async = require('async');
module.exports = {
	execute:function(params, cb){
		async.waterfall([
			function(callback){
				fs.mkdir(path + '../../../../' + 'private', function(err) {
					if (err && err.code !== 'EEXIST') {
						callback( {error:['Could not create needed directories. Please check permissions.']} );
					}
				});
				callback();
			},
			function(callback){
				fs.mkdir(path + '../../../../' + 'private/uploads', function(err) {
					if (err && err.code !== 'EEXIST') {
						callback( {error:['Could not create needed directories. Please check permissions.']} );
					}
				});
				callback();
			},
			function(callback){
				fs.mkdir(path + '../../../../' + 'private/files', function(err) {
					if (err && err.code !== 'EEXIST') {
						callback( {error:['Could not create needed directories. Please check permissions.']} );
					}
				});
				callback();
			}
		], function(err, result){
			if(err){
				cb(err);
				return false;
			}
			fs.readdir(path + '../../../../' + 'private/uploads/', function(err, files){
				var model = {
					files:files
				};
				_.each(model.files, function(file, i){
					model.files[i] = file.replace(/(\.json)$/, '');
				});
				cb( model );
			});

		});
	}
};