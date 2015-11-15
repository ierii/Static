$(document).ready(function () {
	var ME = {
		USE: {},
		DOM: {}
	};
	$('.content').masonry({
		itemSelector: '.item',
		columnWidth: '.head',
		isAnimated: true,
		percentPosition: true

	});
	$('.content').imagesLoaded().progress(function () {
		$('.content').masonry('layout');
	});
});
