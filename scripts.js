$(window).load(function () {

	$('.back').append('<div class="arrow"><</div>');
	$('.next').html('<div class="arrow">></div>');

	$('.project-content[data-project=flow] img').on('mouseenter', function (event) {
		$('.project-content[data-project=flow] .link-button a').addClass('hover');
	}).on('mouseleave', function (event) {
		$('.project-content[data-project=flow] .link-button a').removeClass('hover');
	});;

	// set up events
	$('.project-summary').click(function (event) {
		var project = $(event.currentTarget).data('project');
		var otherProjectDetails = $('.project-content[data-project!=' + project + ']');
		var details = $('.project-content[data-project=' + project + ']');

		$(event.currentTarget).toggleClass('selected');
		$('.project-summary[data-project!=' + project + ']').removeClass('selected');

		otherProjectDetails.hide();
		details.toggle();	
		details.find('.page').hide();
		details.find('.page:first-child').show();
	});

	$('.page .next').click(function (event) {
		var projectDetails = $(event.currentTarget).closest('.project-content');
		var allPages = projectDetails.find('.page');
		var currentPage = $(event.currentTarget).closest('.page');

		var indexOfPage = allPages.index(currentPage);

		if (indexOfPage < allPages.length - 1) {
			var nextPage = $(allPages[indexOfPage + 1]);
			currentPage.hide();
			nextPage.show();
		}
	});

	$('.page .back').click(function (event) {
		var projectDetails = $(event.currentTarget).closest('.project-content');
		var allPages = projectDetails.find('.page');
		var currentPage = $(event.currentTarget).closest('.page');

		var indexOfPage = allPages.index(currentPage);

		if (indexOfPage > 0) {
			var nextPage = $(allPages[indexOfPage - 1]);
			currentPage.hide();
			nextPage.show();
		}
	});
});
