/**
 * Node.js File Upload Example
 *
 * /app/api/models/delete.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
var fs = require('fs');
var path = __dirname;
module.exports = {
	execute:function(params, cb){
		if(params.deletefileId && params.deletefileId.match(/^[\w\-. ]+$/)){
			var pathname = path + '../../../../' + 'private/uploads/' + params.deletefileId + '.json';
			fs.exists(pathname, function(exists) {
				if(!exists) {
					cb({
						error:['File does not exist.']
					});
				}else{
					fs.readFile(pathname, 'utf8', function (err, data) {
						if (err) {
							console.log('Error: ' + err);
							return;
						}
						var fileData = JSON.parse(data);

						fs.unlink(pathname, function(){
							fs.unlink(path + '../../../../' + 'private/files/' + fileData.fileId, function(){
								cb({
									view:'removed'
								});
							});
						});

					});

				}
			});
		}else{
			cb({
				error:['Invalid filename.']
			});
		}
	}
};