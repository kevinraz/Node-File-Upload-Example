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
		path:'index.upload',
		method:'post'
	},
	'/files/:getfileId':{
		path:'index.details',
		method:'get'
	},
	'/files/:putfileId/data':{
		path:'index.createData',
		method:'put'
	},
	'/files/:getfileId/data':{
		path:'index.readData',
		method:'get'
	}
};