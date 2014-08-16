/**
 * Node.js File Upload Example
 *
 * /app/api/index.js
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */

var routes = require('./routes.js');
var fs = require('fs');
var _ = require('lodash');
var path = __dirname;

module.exports = {

	/**
	 * run
	 *
	 * @param request
	 * @param response
	 * @param pathname
	 */
	run:function(request, response, pathname){
		this.app = {
			request:request,
			response:response
		};

		this.route(pathname);
	},


	/**
	 * route
	 *
	 * @param {string} pathname
	 */
	route:function(pathname){
		var _this = this;
		var controllerPath = '';
		pathname = pathname.replace(/^\/api/, '');

		match = _this.matchUrl(pathname,routes);

		if(match[0] && match[0].path){
			controllerPath = path + '/controllers/' +match[0].path.split('.')[0] + '.js';
		}
		fs.exists(controllerPath, function(exists){
			_this.isAllowed(match[0]);

			if(!exists){
				_this.notFound();
				return;
			}

			var controller = require(controllerPath);
			if(controller[match[0].path.split('.')[1]]){
				var output = controller[match[0].path.split('.')[1]](match[1]);
				var options = output.options || {};
				_this.end(output, options);
			}else{
				_this.notFound();
			}
		});
	},


	/**
	 * matchUrl
	 *
	 * @param url
	 * @param mapping
	 * @returns {*[]}
	 */
	matchUrl:function(url,mapping){
		var _this = this;
		var optionalParam = /\((.*?)\)/g,
			namedParam    = /(\(\?)?:\w+/g,
			splatParam    = /\*\w+/g,
			escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g,
			regex,route,match,requestPath,params,paramsArr,paramNames;
		url = url.replace(/^\//,'');
		_.each(mapping,function(request,path){
			paramNames = [];
			route = path.replace(escapeRegExp, '\\$&')
				.replace(optionalParam, '(?:$1)?')
				.replace(namedParam, function(match, optional) {
					paramNames.push(match.replace(/[:*]/, ''));
					return optional ? match : '([^\/]+)';
				})
				.replace(splatParam, '(.*?)');
			route = '/' + route.replace(/^\//,'');
			regex = new RegExp('^' + route + '$');
			match = ('/'+url).match(regex);
			if(match){
				requestPath = request;
				paramsArr = match.slice(1);
				params = {};
				_.each(paramsArr, function(param, i){
					params[paramNames[i]] = param;
				});
				if((request.method || 'get').toLowerCase() === _this.app.request.method.toLowerCase()){
					return false;
				}
			}
		});

		return requestPath ? [requestPath,params] : false;
	},

	/**
	 * isAllowed
	 * Simply checks for the existence of an api key and proper method type.
	 *
	 * @param {object} route
	 */
	isAllowed:function(route){
		var message = '';
		var code;
		if(!debug && !this.app.request.headers['api-key']){
			code = 403;
			message = '403 Permission Denied: Missing API Key.';
		}
		if(route && (route.method || 'get').toLowerCase() !== this.app.request.method.toLowerCase()){
			code = 405;
			message = '405 Method Not Allowed';
		}

		if(code){
			var json = {
				error:[
					{
						loadAction:'notAllowed',
						message: message
					}
				]
			};

			this.end(json, {
				code:code,
				contentType:'text/json'
			});
		}
	},

	notFound:function(){
		var json = {
			error:[
				{
					loadAction:'notFound',
					message: '404 Not Found.'
				}
			]
		};

		this.end(json, {
			code:404,
			contentType:'text/json'
		});
	},


	/**
	 * end
	 *
	 * @param {string|object} output
	 * @param {object} options
	 */
	end:function(output, options){
		options = _.extend({
			code:200,
			contentType:'text/html'
		}, options);

		if(typeof output === 'object'){
			options.contentType = 'text/json';
			output = JSON.stringify(output);
		}

		this.app.response.writeHead(options.code, {"Content-Type": options.contentType});
		this.app.response.write(output);
		this.app.response.end();

		return false;
	}
};