$(function(){
	$('.nav-list').find('li').each(function(){
		var li = $(this);
		li.find('a').on('click', function() {
			var a = $(this);
			a.tab('show');

			$('.nav-list').find('li').removeClass('active');
			li.addClass('active');
		});
	});

	$("a[href='#count']").tab('show');
});