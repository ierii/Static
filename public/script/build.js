$(document).ready(function () {
	var ME = {
		USE: {
			mainurl: '/theme',
		},
		DOM: {
			$doc: $(document),
			$wrapper: $('#wrapper'),
			$upwrapper: $('#upwrapper'),
			$menuTemplate: $('#menuTemplate'),
			$addTheme: $('#addTheme')
		},
		TMP: window.juicer,
		METHODS: {}
	};
	ME.METHODS.BuildDOM = function ($wrapper, $template) {
		var build = ME.TMP($template.html());
		return function (data, handle) {
			$wrapper.append(build.render(data));
			if (handle && typeof handle === 'function') {
				handle($wrapper);
			}
		}
	};
	ME.METHODS.buildMenu = ME.METHODS.BuildDOM(ME.DOM.$wrapper, ME.DOM.$menuTemplate);
	ME.METHODS.buildTheme = ME.TMP(ME.DOM.$menuTemplate.html());
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
		console.log('init.......');
		var $this = $(this);
		$this.on('click', '.delPro .theme', function (event) {
			event.preventDefault();

		});
		$this.on('click', '.delPro .delBtn', function (event) {
			event.preventDefault();
			var $self=$(this),
				id = $self.data('id'),
				fpath=$self.data('fpath');
			if (!(id&&fpath)) return console.log('id不存在！');
			var deleteQuery = ME.USE.mainurl + '?id=' + id+"&fpath="+fpath;
			$.get(deleteQuery).done(function (data) {
				if (data.err) return console.log('删除出错！');
				$self.parent().remove();

			}).fail(function () {
				console.log('删除请求发生一些错误！');
			});
		});
	});

});
