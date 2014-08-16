$(function() {

	var page = window.location.pathname;

	if(page === '/'){
		app.fetch({
			url:'/api/'
		}, function(result, err){
			if(err){
				console.log(err);
				return false;
			}
			if(result.files && result.files.length){
				_.each(result.files, function(file){
					fileHtml = '<li>';
					fileHtml += '<a href="/files/' + file + '"><i class="icon"></i>' + file + '</a>';
					fileHtml += '</li>'
					$('.file-list ul').append(fileHtml);
				});
			}else{
				$('.file-list ul').append('<li style="text-align: center">No Files Found.</li>');
			}

			app.events({
				'click .create':'create',
				'click .file-list a': 'read'
			});
		});
	}
	/*
	 var editor = ace.edit("editor");
	 editor.setTheme("ace/theme/chrome");
	 editor.getSession().setMode("ace/mode/javascript");
	*/


});

var app = {
	methods: {
		create:function(){
			alert('hi');
			return false;
		},
		read:function(e){
			var $el = $(e.currentTarget);
			var href = $el.attr('href');

			app.fetch({
				url:'/api' + href
			});
			return false;
		},
		update:function(){},
		delete:function(){}
	},
	fetch:function(options, cb){
		options = _.extend({
			url: '',
			type: "GET",
			headers: {}
		}, options);

		if(options.headers && !options.headers['api-key']){
			options.headers['api-key'] = 'kUom8sAaqB94NobFZpHibphC1x1iO7L1';
		}
		$.ajax(options)
			.done(function(result) {
				cb(result);
			})
			.fail(function(result) {
				cb(result, 'error');
			});
	},
	events:function(eventBindings){
		_.each(eventBindings, function(funcName, binding){
			var ev = binding.split(/ (.+)?/);
			$(ev[1]).on(ev[0], app.methods[funcName]);
		});
	}
};