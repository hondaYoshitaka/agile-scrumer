$(function(){
	$('.nav-list').find('li').each(function(){
		var li = $(this);
		li.find('a').on('click', function() {
			$('.nav-list').find('li').removeClass('active');
			li.addClass('active');
		});
	});
});