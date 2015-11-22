$(document).ready(function () {
	var ME = {
		USE: {
			mainurl: '/theme',
			filesurl: '/files',
			dataChche: {},
			currId: null
		},
		DOM: {
			$doc: $(document),
			$wrapper: $('#wrapper'),
			$upwrapper: $('#upwrapper'),
			$menuTemplate: $('#menuTemplate'),
			$addTheme: $('#addTheme'),
			$dragPanel: $('#dragPanel'),
			$uplaodPrompt: $('#uplaodPrompt'),
			$filesTemplate: $('#filesTemplate'),
			$filesWrapper: $('#filesWrapper'),
		},
		TMP: window.juicer,
		METHODS: {}
	};
	/*几个方法*/
	ME.METHODS.BuildDOM = function ($wrapper, $template, method) {
		var build = ME.TMP($template.html());
		return function (data, handle) {
			$wrapper[method](build.render(data));
			if (handle && typeof handle === 'function') {
				handle($wrapper);
			}
		}
	};
	ME.TMP.register('buildPath', function (path) {
		return path.replace(/^public\//g,'');
	});
	ME.METHODS.buildMenu = ME.METHODS.BuildDOM(ME.DOM.$wrapper, ME.DOM.$menuTemplate, 'append');
	ME.METHODS.buildTheme = ME.TMP(ME.DOM.$menuTemplate.html());
	ME.METHODS.buildFiles = ME.METHODS.BuildDOM(ME.DOM.$filesWrapper, ME.DOM.$filesTemplate, 'prepend');
	/*上传的设置选项*/
	ME.USE.uploadOption = {
		url: ME.USE.filesurl,
		extraData: null,
		fileName: 'files',
		onInit: function () {
			console.log('拖拽插件初始化成功！');
		},
		onNewFile: function (id, file) {
			var msg = '添加了上传文件：';
			msg += ' ID:' + id;
			msg += ' 文件名：' + file.name;
			msg += ' 文件大小：' + file.size;
			msg += ' 类型：' + file.type;
			ME.DOM.$uplaodPrompt.text(msg);
		},
		onBeforeUpload: function (id) {
			console.log('准备上传文件：' + id);
		},
		onComplete: function () {
			ME.DOM.$uplaodPrompt.text('文件上传完成-可以拖拽或点击继续添加文件');
		},
		onUploadProgress: function (id, percent) {
			var msg = '上传进度：文件#' + id + '进度' + percent + '%';
			ME.DOM.$uplaodPrompt.text(msg);

		},
		onUploadSuccess: function (id, data) {
			ME.DOM.$uplaodPrompt.text('成功上传 #' + id);
			console.log('服务器返回的数据数据是：',data);
			ME.DOM.$filesWrapper.trigger('build',[[data]]);
		},
		onUploadError: function (id, message) {
			console.log('文件上传失败 #' + id + ': ' + message);
			var msg = '文件上传出错 #' + id + ': ' + message;
			ME.DOM.$uplaodPrompt.text(msg);
		}

	};
	/*初始化*/
	$.getJSON(ME.USE.mainurl).done(function (data) {
		ME.METHODS.buildMenu({
			menuList: data
		}, function ($wrapper) {
			$wrapper.trigger('init');
		});
	}).fail(function () {
		console.log('数据有误');
	});
	/*点击添加主题项*/
	ME.DOM.$wrapper.on('click', '.addPro #addProBtn', function (event) {
		event.preventDefault();
		var info = $(this).prev().val().trim();
		if (!info) return;
		$.post(ME.USE.mainurl, {
			info: info
		}).done(function (data) {
			ME.DOM.$addTheme.after(ME.METHODS.buildTheme.render({
				menuList: [data]
			}))
		}).fail(function () {
			console.log('the posrt theme err');
		});
	});
	/*初始化项目的打开和删除*/
	ME.DOM.$wrapper.on('init', function (event) {
		var $this = $(this);
		/*添加主题*/
		$this.on('click', '.delPro .theme', function (event) {
			event.preventDefault();
			ME.DOM.$upwrapper.show(800);
			var $self = $(this),
				id = $self.data('id'),
				fpath = $self.data('fpath');
			if (ME.USE.currId === id) return;
			ME.USE.currId = id;
			ME.DOM.$upwrapper.trigger('initFileLoad',{
				sid:id
			});
			ME.DOM.$upwrapper.trigger('initUpload', {
				id: id,
				fpath: fpath
			});

		});
		/*删除主题*/
		$this.on('click', '.delPro .delBtn', function (event) {
			event.preventDefault();
			var $self = $(this),
				id = $self.data('id'),
				fpath = $self.data('fpath');
			if (!(id && fpath)) return console.log('id不存在！');
			var deleteQuery = ME.USE.mainurl + '?id=' + id + "&fpath=" + fpath;
			$.get(deleteQuery).done(function (data) {
				if (data.err) return console.log('删除出错！');
				$self.parent().remove();

			}).fail(function () {
				console.log('删除请求发生一些错误！');
			});
		});
	});
	/*用于关闭上传面板的*/
	ME.DOM.$upwrapper.on('click', '#closeBtn', function (event) {
		ME.DOM.$upwrapper.hide(800);
	});
	/*初始化图片列表*/
	ME.DOM.$upwrapper.on('initFileLoad',function(event,data){
		var query=ME.USE.filesurl+'?sid='+data.sid;
		ME.DOM.$filesWrapper.empty();
		$.getJSON(query).done(function(data){
			ME.DOM.$filesWrapper.trigger('build',[data]);
		}).fail(function(){
			console.log('有一些问题呀。。。。');
		});
	});
	/*初始化上传面板*/
	ME.DOM.$upwrapper.on('initUpload', function (event, data) {
		console.log('init loading.....');
		ME.USE.uploadOption.extraData = data;
		ME.DOM.$dragPanel.dmUploader(ME.USE.uploadOption);
	});
	/*初始化文件列表面板*/
	ME.DOM.$filesWrapper.on('build', function (event, data) {
		console.log('构建文件列表',data);
		ME.METHODS.buildFiles({
			filesList: data
		}, function ($wrapper) {
			$wrapper.masonry({
				itemSelector: '.item',
				columnWidth: '.item',
				percentPosition: true
			});
			$wrapper.imagesLoaded().progress(function () {
				$wrapper.masonry('layout');
			});
		});
	});
	/*初始化文件列表的删除功能*/
	ME.DOM.$filesWrapper.on('click','.item .del',function(event){
		var $this=$(this),
			id=$this.data('id'),
			path=$this.data('path');
		if(!(id&&path))return console.log('标签中不包含id和path');
		var query=ME.USE.filesurl+'?id='+id+'&path='+path;
		$this.text('删除中...').removeClass('.del');
		$.getJSON(query).done(function(data){
			if(data.err)return console.log('删除数据出错：',data.err);
			$this.parent().hide('slow').remove();
		}).fail(function(){
			console.log('有点问题哦哦哦');
		});
	});

});
