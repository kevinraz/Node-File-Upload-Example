/**
 * Node.js File Upload Example
 *
 * /app/api/routes.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */
module.exports = {
	'/': {
		path:'index.home',
		method:'get'
	},
	'/files':{
		path:'index.create',
		method:'post'
	},
	'/files/:getfileId':{
		path:'index.read',
		method:'get'
	},
	'/files/:putfileId/data':{
		path:'index.update',
		method:'put'
	},
	'/files/:getfileId/data':{
		path:'index.readData',
		method:'get'
	},
	'/download/files/:getfileId':{
		path:'index.downloadData',
		method:'get'
	},
	'/files/:deletefileId/data':{
		path:'index.delete',
		method:'delete'
	}
};