$(document).ready(function () {
	var ME = {
		USE: {
			mainurl: 'data/main.json'
		},
		DOM: {
			$doc: $(document),
			$wrapper: $('#wrapper'),
			$upwrapper: $('#upwrapper'),
			$menuTemplate: $('#menuTemplate')
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
	}
	$.getJSON(ME.USE.mainurl).done(function (data) {
		var buildMenu = ME.METHODS.BuildDOM(ME.DOM.$wrapper, ME.DOM.$menuTemplate);
		buildMenu(data, function ($wrapper) {
			$wrapper.trigger('init');
		});
	}).fail(function () {
		console.log('数据有误');
	});
	ME.DOM.$wrapper.on('init', function (event) {
		var $this = $(this);
		$this.on('click', '.addPro #addProBtn',function (event) {
			event.preventDefault();
		});
		$this.on('click', 'delPro .theme', function (event) {
			event.preventDefault();

		});
		$this.on('click', 'delPro .delBtn', function (event) {
			event.preventDefault();

		});


	});

});
