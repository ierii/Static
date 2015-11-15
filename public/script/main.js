$(document).ready(function () {
	var ME = {
		USE: {},
		DOM: {
			$contents: {}
		}
	};
	var $contents = $('.content').masonry({
		itemSelector: '.item',
		columnWidth: '.head',
		percentPosition: true
	});
	$contents.imagesLoaded().progress(function () {
		$contents.masonry('layout');
	});
});
