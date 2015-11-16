$(document).ready(function () {
	var ME = {
		USE: {
			menuDatas: {}
		},
		DOM: {
			$doc: $(document),
			$wrapper: $('#wrapper'),
			$menus: $('#wrapper li .menu'),
			$contents: $('#wrapper li .content'),
			$menuTemplate: $('#menuListTemplate'),
			$contentTemplate: $('#contentTemplate')
		},
		TMP: window.juicer,
		METHODS: {}
	};
	ME.METHODS.BuildDom = function ($wrapper, $template) {
		var buildTmp = ME.TMP($template.html());
		return function (data, handle) {
			$wrapper.append(buildTmp.render(data));
			handle($wrapper);
		}
	};
	(function init() {
		var buildMenu = ME.METHODS.BuildDom(ME.DOM.$wrapper, ME.DOM.$menuTemplate);
		$.getJSON('data/main.json')
			.done(function (data) {
				buildMenu(data, function ($wrapper) {
					$wrapper.on('click', 'li .menu', function (event) {
						var $this = $(this),
							url = $this.data('url'),
							index = $this.data('index'),
							$content = $this.next();
						$this.find('i').text('Loading......');
						$this.on('upstate', function () {
							$this.find('i').text('Loading ok').hide('slow');
							$this.off('upstate');
						});
						$content.trigger('loadContent', {
							url: url,
							index: index
						});
						$content.fadeToggle('slow');
					});
				});
			})
			.fail(function () {
				console.log('数据有错！');
			});
		ME.DOM.$wrapper.on('loadContent', 'li .content', function (event, data) {
			var $this = $(this),
				url = data.url,
				index = data.index,
				isHidden = $this.is(':hidden');
			var buildContent = ME.METHODS.BuildDom($this, ME.DOM.$contentTemplate);
			/*如果是代开的证明数据已经加载过了*/
			if (!isHidden) return;
			if (ME.USE.menuDatas[index]) return;
			ME.USE.menuDatas[index] = url;
			$.getJSON(url).done(function (data) {
				buildContent(data, function ($content) {
					$content.masonry({
						itemSelector: '.item',
						columnWidth: '.head',
						percentPosition: true
					});
					$content.imagesLoaded(function () {
						$content.prev().trigger('upstate');
						$content.masonry('layout');
					}).progress(function () {
						$content.masonry('layout');
					});
				})
			}).fail(function () {
				console.log('获取数据失败！');
			});
		});
	})();
});
