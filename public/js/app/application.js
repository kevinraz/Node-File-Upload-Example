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
			$('.file-list ul').append('<li class="no-files" style="text-align: center">No Files Found.</li>');
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
				'submit form':'submitForm',
				'dragover body': 'dragOver',
				'dragend body': 'dragEnd',
				'drop body': 'onDrop'
			},
			submitForm:function(e){
				var _this = this;
				var $form = $(e.currentTarget);
				var url = $form.attr('action');
				var method = $form.attr('method');

				if($form.find('button').attr('disabled') !== undefined){
					return false;
				}

				if($form.hasClass('manual-create')){
					app.fetch({
						url:url,
						method:method,
						data:$form.serialize(),
						headers:{
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
						}
					}, function(file){
						var add = true;
						$('.file-list ul a').each(function(i, el){
							var $el = $(el);
							if($el.text() === file.fileId){
								add = false;
							}
						});
						if(add){
							$('.no-files').remove();
							$('.file-list ul').prepend(app.templates['file-list-item']({files:[(file.fileData || {}).fileId]}));
							app.bindEvents('home');
						}


						app.render({
							$el:$('.app-body'),
							view:file.view,
							data:file
						});
					});
				}else{
					app.fetch({
						url:url,
						method:method,
						data:$form.serialize(),
						contentType:false
					}, function(data){
						if (_this.tests.formData) {
							var redirect = 'view';
							if(!_.isArray(data.fileData)){
								data.fileData = [data.fileData];
								redirect = 'file';
							}
							_.each(data.fileData, function(file,i){



								var $progress = $('.upload-progress');
								var xhr = new XMLHttpRequest();
								xhr.open('PUT', '/api/files/' + file.fileId + '/data');
								//xhr.setRequestHeader("Content-type",'multipart/form-data; '/*file['Content-Type']*/);
								xhr.setRequestHeader('api-key','kUom8sAaqB94NobFZpHibphC1x1iO7L1');
								xhr.onload = function () {
									$progress.html(100);
									$progress.val(100);


									var add = true;
									$('.file-list ul a').each(function(i, el){
										var $el = $(el);
										if($el.text() === file.fileId){
											add = false;
										}
									});
									if(add){
										$('.no-files').remove();
										$('.file-list ul').prepend(app.templates['file-list-item']({files:[file.fileId]}));
										app.bindEvents('home');
									}

									if(redirect === 'file'){
										app.render({
											$el:$('.app-body'),
											view:'read',
											data:{
												fileData:file
											}
										});
									}

								};

								if (_this.tests.progress) {
									xhr.upload.onprogress = function (event) {
										if (event.lengthComputable) {
											var complete = (event.loaded / event.total * 100 | 0);
											$progress.html(complete);
											$progress.val(complete);
											console.log(complete);
										}
									}
								}

								xhr.send(_this.formData);
							});
						}
					});
				}
				return false;
			},
			dragOver:function(){
				$('body').addClass('drag-hover');
				return false;
			},
			dragEnd:function(){
				$('body').removeClass('drag-hover');
				return false;
			},
			onDrop:function(e){
				$('body').removeClass('drag-hover');
				$('.upload-btn').removeAttr('disabled');
				this.uploadFiles(e.originalEvent.dataTransfer.files);
				return false;
			},
			uploadFiles:function(files) {
				console.log(files);
				this.formData = this.tests.formData ? new FormData() : null;
				for (var i = 0; i < files.length; i++) {
					if (this.tests.formData) this.formData.append('file', files[i]);
					this.showFileName(files[i]);
				}
				return false;
			},
			showFileName: function (file) {
				var fileform= '<div class="input">';
				fileform += '<label>File Name</label>';
				fileform += '<p class="filename">' + file.name + ' (' + (file.size ? (file.size / 1024 | 0) + 'K' : '') + ')</p>';
				fileform += '<label for="description">File Description</label>';
				fileform += '<input type="text" name="description[]"/>';
				fileform += '<input type="hidden" name="filename[]" value="'+file.name+'" />';
				fileform += '</div>';

				$('.no-files').remove();
				$('.upload-file-list').append(fileform);
			},
			afterRender:function(){
				var _this = this;
				var $dropArea = $('.drop-area');
				var $fileUpload = $('.upload');

				this.tests = {
					filereader: typeof FileReader != 'undefined',
					dnd: 'draggable' in document.createElement('span'),
					formData: !!window.FormData,
					progress: "upload" in new XMLHttpRequest
				};

				if (!this.tests.dnd) {
					$dropArea.hide();
					$fileUpload.show();
					/*$fileUpload.querySelector('input').onchange = function () {
						readfiles(this.files);
					};*/
				}

				var support = {
					filereader: $('.file-reader'),
					formData: $('.form-data'),
					progress: $('.progress')
				};

				"filereader formData progress".split(' ').forEach(function (api) {
					if (_this.tests[api] === false) {
						support[api].addClass('fail');
					} else {
						support[api].addClass('hidden');
					}
				});
			},
			close:function(){
				$('body').off('drop');
				this.formData = null;
				delete this;
			}
		},
		createData:{
			events:{
				'submit form':'submitForm'
			},
			submitForm:function(e){
				var _this = this;
				var $form = $(e.currentTarget);
				var url = $form.attr('action');
				var method = $form.attr('method');

				app.fetch({
					url:url,
					method:method,
					data:{
						fileData:app.editor.getSession().getValue(),
						description:_this.model.fileData.description
					},
					headers:{
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
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
				var $btn = $form.find('.create-btn').data('filename');
				data += '&fileData=' + app.editor.getSession().getValue();

				app.fetch({
					url:url,
					method:method,
					data:data,
					headers:{
						'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
					}
				}, function(data){
					$('[data-filename="'+$btn+'"] a').html('<i class="icon"></i>' + $form.find('#name').val().replace(/%20| /g, ''));
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

	fetch:function(options, cb){
		options = _.extend({
			url: '',
			type: "GET",
			headers: {}
		}, options);

		if(options.headers && !options.headers['api-key']){
			options.headers['api-key'] = 'kUom8sAaqB94NobFZpHibphC1x1iO7L1';
			options.headers['async'] = true;
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
			$(ev[1]).off(ev[0], app.views[viewName][funcName]).on(ev[0], app.views[viewName][funcName].bind(app.views[viewName]));
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
	validate:function(){}
};





