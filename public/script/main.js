$(document).ready(function () {
	var ME = {
		USE: {},
		DOM: {
			$doc:$(document),
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
	/*登dom结构*/
	ME.DOM.$contents.masonry({
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
						$this=$(this);
						$this.find('i').text('Loding......');
						$this.on('upstate',function(){
							$this.text('Load OK');
						});
						$this.next().toggle('slow');
					});
				});
			})
			.fail(function () {
				console.log('数据有错！');
			});
		ME.DOM.$contents.on('init',function(event,data){

		});

	})();
});
