$(function() {
	app.fetch({
		url:'/api/'
	}, function(result, err){
		if(err){
			console.log(err);
			return false;
		}
		if(result.files && result.files.length){
			$('.file-list ul').append(app.templates['file-list-item'](result));
		}else{
			$('.file-list ul').append('<li style="text-align: center">No Files Found.</li>');
		}
		app.bindEvents('home');
	});
	app.loadTemplates();
	window.onbeforeunload = function(e) {
		return 'This is a stateless web app. Refreshing or leaving could cause you to lose data.';
	};
});

var app = {
	views:{
		home:{
			events:{
				'click .create':'create',
				'click .file-list a': 'read'
			},
			create:function(){
				app.render({
					$el:$('.app-body'),
					view:'create'
				});
				return false;
			},
			read:function(e){
				var $el = $(e.currentTarget);
				var href = $el.attr('href');

				app.fetch({
					url:'/api' + href
				}, function(data){
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});
				return false;
			}
		},
		create:{
			events:{
				'submit form':'submitForm'
			},
			submitForm:function(e){
				var $form = $(e.currentTarget);
				var url = $form.attr('action');
				var method = $form.attr('method');

				app.fetch({
					url:url,
					method:method,
					data:$form.serialize()
				}, function(data){
					$('.file-list ul').prepend(app.templates['file-list-item']({files:[data.fileData.fileId]}));
					app.bindEvents('home');
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});

				return false;
			}
		},
		createData:{
			events:{
				'submit form':'submitForm'
			},
			submitForm:function(e){
				var $form = $(e.currentTarget);
				var url = $form.attr('action');
				var method = $form.attr('method');

				app.fetch({
					url:url,
					method:method,
					data:{
						fileData:app.editor.getSession().getValue()
					},
					headers:{
						'Content-Type':$('[name="Content-Type"]').val()
					}
				}, function(data){
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});

				return false;
			},
			afterRender:function(){
				app.editor = ace.edit("editor");
				app.editor.setTheme("ace/theme/chrome");
				app.editor.getSession().setMode("ace/mode/javascript");
			},
			close:function(){
				app.editor.destroy();
				delete app.editor;
			}
		},
		read:{
			events:{
				'click .view-file-data':'readData',
				'click .delete-file':'delete'
			},
			readData:function(e){
				var $el = $(e.currentTarget);
				var href = $el.attr('href');

				app.fetch({
					url:'/api' + href
				}, function(data){
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});
				return false;
			},
			delete:function(e){
				var $el = $(e.currentTarget);
				var href = $el.attr('href');
				var del = window.confirm('Are you sure you want to delete this file?');

				if(del){
					app.fetch({
						url:'/api' + href,
						method:'DELETE'
					}, function(data){
						$('[data-filename="'+$el.data('filename')+'"]').remove();
						app.render({
							$el:$('.app-body'),
							view:data.view
						});
						return false;
					});
				}

				return false;
			}
		},
		readData:{
			events:{
				'click .back':'readData',
				'submit form':'submitForm'
			},
			readData:function(e){
				var $el = $(e.currentTarget);
				var href = $el.attr('href');

				app.fetch({
					url:'/api' + href
				}, function(data){
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});
				return false;
			},
			submitForm:function(e){
				var $form = $(e.currentTarget);
				var url = $form.attr('action');
				var method = $form.attr('method');
				var data = $form.serialize();
				data += '&fileData=' + app.editor.getSession().getValue();

				app.fetch({
					url:url,
					method:method,
					data:data,
					headers:{
						'Content-Type':$('[name="Content-Type"]').val()
					}
				}, function(data){
					app.render({
						$el:$('.app-body'),
						view:data.view,
						data:data
					});
				});

				return false;
			},
			afterRender:function(){
				app.editor = ace.edit("editor");
				app.editor.setTheme("ace/theme/chrome");
				app.editor.getSession().setMode("ace/mode/text");
				app.editor.session.setValue(this.model.fileData.content);
			},
			close:function(){
				app.editor.destroy();
				delete app.editor;
			}
		},
		removed:{}
	},
	utils:{

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
				if(result.error){
					var msg = '';
					_.each(result.error, function(errMsg){
						msg += errMsg + "\r\n";
					})

					alert(msg);
					return false;
				}
				cb(result);
			})
			.fail(function(result) {
				cb(result, 'error');
			});
	},
	bindEvents:function(viewName){
		_.each(app.views[viewName].events, function(funcName, binding){
			var ev = binding.split(/ (.+)?/);
			$(ev[1]).off(ev[0], app.views[viewName][funcName]).on(ev[0], app.views[viewName][funcName]);
		});
	},
	unbindEvents:function(viewName){
		_.each(app.views[viewName].events, function(funcName, binding){
			var ev = binding.split(/ (.+)?/);
			$(ev[1]).off(ev[0], app.views[viewName][funcName]);
		});
	},
	render:function(options){
		if(!app.views[options.view]){
			alert('View '+options.view+' doesn\'t exists.');
			return false;
		}
		if(!app.views[options.view].template && app.templates[options.view]){
			app.views[options.view].template = options.view;
		}
		if(app.views[options.view].template){
			var output = app.templates[app.views[options.view].template](options.data);
			if(options.append){
				options.$el.append(output);
			}else if(options.prepend){
				options.$el.prepend(output);
			}else{
				options.$el.html(output);
			}
			if(app.currentView){
				app.unbindEvents(app.currentView);
				if(app.views[app.currentView].close){
					app.views[app.currentView].close();
				}
			}

			app.bindEvents(options.view);
			app.currentView = options.view;
			app.views[options.view].model = options.data;

			if(app.views[options.view].afterRender){
				app.views[options.view].afterRender();
			}
		}else{
			alert('No template for view ' + options.view + ' could be found.');
			return false;
		}
	},
	loadTemplates:function(){
		_.templateSettings.variable = "data";
		_.each($('.template'), function(tpl, i){
			var $tpl = $(tpl);
			var tplName = $tpl.data('template-name');
			var html = $tpl.html();
			app.templates[tplName] = _.template(html);
		});
	},
	templates:{},
	validate:function(){

	}
};