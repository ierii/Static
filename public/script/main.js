$(document).ready(function () {
	var ME = {
		USE: {
			mainurl:'public/database/main.json',
			menuDatas: {},
			ZeroClipboardPath:'public/script/ZeroClipboard.swf',
			basePath: ''
		},
		DOM: {
			$doc: $(document),
			$prompt:$('#prompt'),
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
	ME.METHODS.GetCurrPath = function () {
		var loc = window.location.href,
			path = loc.replace(/\w+\.html$/g, '');
		return path;
	};
	ME.USE.basePath = ME.METHODS.GetCurrPath();
	/*用于生成正常url*/
	ME.TMP.register('buildURL', function (url) {
		return ME.USE.basePath + url;
	});
	/*用来生成md url*/
	ME.TMP.register('buildMURL', function (url) {
		return '![](' + ME.USE.basePath + url + ')';
	});
	ME.TMP.register('buildFielsUrl', function (path) {
		return path+'/menu.json';
	});
	ME.DOM.$doc.on('copyOK',function(){
		ME.DOM.$prompt.show(400).delay(800).hide(400);
	});
	/*加载图片内容*/
	ME.DOM.$wrapper.on('loadContent', 'li .content', function (event, data) {
		var $this = $(this),
			url = data.url,
			index = data.index,
			isHidden = $this.is(':hidden');
		var buildContent = ME.METHODS.BuildDom($this, ME.DOM.$contentTemplate);
		/*如果是为真的证明数据已经加载过了*/
		if (!isHidden) return;
		if (ME.USE.menuDatas[index]) return;
		ME.USE.menuDatas[index] = url;
		$.getJSON(url).done(function (data) {
			buildContent({filesList:data}, function ($content) {
				$content.masonry({
					itemSelector: '.item',
					columnWidth: '.head',
					percentPosition: true,
					 isAnimated: true
				});
				$content.imagesLoaded(function () {
					$content.prev().trigger('upstate');
					$content.masonry('layout');
					$content.trigger('buildCopy');
				}).progress(function () {
					$content.masonry('layout');
				});
			})
		}).fail(function () {
			console.log('获取数据失败！');
		});
	});
	/*出事化url的复制*/
	ME.DOM.$wrapper.on('buildCopy', 'li .content', function (event) {
		var $this = $(this),
			$items = $this.find('.item');
		$items.each(function (i, e) {
			var $e = $(e);
			var set = {
				path: ME.USE.ZeroClipboardPath,
				copy: function () {
					return $(this).prev().val();
				}
			}
			$e.find('.url button').zclip(set);
			$e.find('.murl button').zclip(set);
		});

	});
	(function init() {
		var buildMenu = ME.METHODS.BuildDom(ME.DOM.$wrapper, ME.DOM.$menuTemplate);
		$.getJSON(ME.USE.mainurl)
			.done(function (data) {
				buildMenu({menuList:data}, function ($wrapper) {
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

	})();
});
