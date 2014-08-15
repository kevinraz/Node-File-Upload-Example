/**
 * Node.js File Upload Example
 *
 * /app/index.js
 * This is the main application file, the server is configured and created here.
 * Some API, and UI methods may be called from this file, but logic for each lives
 * in the API and UI directories respectively.
 *
 *
 * @package Example
 * @author Kevin Razmus
 * @version 1.0.0
 */


// Include Dependency Modules
var connect = require('connect');
var http = require('http');
var URL = require('url');

// Include API and UI
var api = require('./api/index.js');
var ui = require('./ui/index.js');


module.exports = {

	config:{
		debug:true,
		logging: {
			message: true,
			warn:true,
			error:true,
			stack:true
		}
	},


	/**
	 * listen
	 * Call this from your app to start your server.
	 *
	 * @param port
	 */
	listen:function(port){
		if(!port){
			throw new Error('When calling listen, a port is required.');
		}

		this.log('Starting HTTP server on port ' + port);

		var app = connect()
			.use(connect.timeout(600000))//timeout request in 2 minutes
			.use(connect.cookieParser())
			.use(connect.static('public'))
			.use(function(request, response){
				var pathname = URL.parse(request.url).pathname;

				if(pathname.indexOf('/api') > -1){
					api.run(request, response, pathname);
				}else{
					ui.run(request, response, pathname)
				}
			});

		this.setupExitHandlers();
		this.createServer(port, app);

		//TODO: Add domain for async error handling.
	},


	/**
	 * createServer
	 * This is separate so if we decide to use cluster we can wrap
	 * our connect server in the callback of a process manager.
	 *
	 * @param port
	 * @param app
	 * @returns {object}
	 */
	createServer:function(port, app){
		return http.createServer(app).listen(port);
	},


	/**
	 * setupExitHandlers
	 * This can be used to run some quick functions on application exit.
	 * Currently just logging which exit message was received.
	 */
	setupExitHandlers:function(){
		var _this = this;

		process.on('SIGHUP',function() {
			// graceful restart
			_this.log('Received SIGHUP, nothing implemented for this.');
		});

		process.on('SIGTERM',function() {
			_this.log('Received SIGTERM, shutting down.');
			process.exit(0);
		});

		process.on('SIGINT',function() {
			_this.log('Received SIGINT, shutting down.');
			process.exit(0);
		});

		// Doesn't work on OSx
		/*process.on('SIGSTOP',function() {
		 _this.log('Received SIGSTOP, sending exit message.');
		 process.send('exit');
		 });*/

		process.on('uncaughtException', function(err){
			_this.log(err, 'error');
			process.exit(1);
		});

		process.on('exit',function() {
			_this.log('Exiting master process');
			process.exit(0);
		});
	},


	/**
	 * Logs messages to console, adding a date/time stamp.
	 *
	 * @param string
	 * @param type
	 */
	log:function(string,type){
		if(!type || type === 'log'){
			if(this.config.logging.message && string){
				console.log(this.dateTime() + ' - ' + string);
			}else if(null === string){
				console.log('');
			}
		}else if(type === 'warn' && this.config.logging.warn){
			console.warn(this.dateTime() + ' - ' + string);
		}else if(type === 'error' && this.config.logging.error){
			var stack = this.config.logging.stack ? "\r\n" + string.stack : '';
			console.error(this.dateTime() + ' - ' + 'uncaughtException: ' + string.message + stack, 'error');
		}
	},


	/**
	 * dateTime
	 * A single method to call to get a date.
	 * We only need to change it here if a specific date format is needed in the application.
	 *
	 * @returns {string}
	 */
	dateTime:function(){
		return (new Date()).toISOString();
	}

};