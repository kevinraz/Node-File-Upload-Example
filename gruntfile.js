module.exports = function (grunt) {
	// Project configuration.
	grunt.initConfig({
		less: {
			compile: {
				options: {
					compress: true
				},
				files: {'./public/styles/css/app.css':'./public/styles/less/_index.less'}

			}
		},
		'closure-compiler': {
			full: {
				closurePath: 'bin/google-closure',
				js: [
					'./public/js/libs/jquery.js',
					'./public/js/libs/lodash.js',
					'./public/js/app/application.js'

				],
				jsOutputFile:'./public/js/application.min.js',
				maxBuffer: 500,
				reportFile: 'logs/closure/application.min.js.report.txt',
				noreport: true,
				options: {
					language_in: 'ECMASCRIPT5',
					compilation_level: 'SIMPLE_OPTIMIZATIONS'
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-closure-compiler');
	grunt.registerTask('default', ['less', 'closure-compiler:full']);
};