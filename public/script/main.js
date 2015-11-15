$(document).ready(function () {
	var ME = {
		USE: {},
		DOM: {
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
	/*瀑布流设置*/
	ME.DOM.$contents = $('.content').masonry({
		itemSelector: '.item',
		columnWidth: '.head',
		percentPosition: true
	});
	ME.DOM.$contents.imagesLoaded().progress(function () {
		ME.DOM.$contents.masonry('layout');
	});
	(function init() {
		var buildMenu = ME.METHODS.BuildDom(ME.DOM.$wrapper, ME.DOM.$menuTemplate);
		$.getJSON('data/main.json')
			.done(function (data) {
				buildMenu(data, function ($wrapper) {
					$wrapper.on('click', 'li .menu', function (event) {
						/*隐藏或显示列表*/
						$(this).next().toggle('slow');
					});
				});
			})
			.fail(function () {
				console.log('数据有错！');
			});

	})();
});
