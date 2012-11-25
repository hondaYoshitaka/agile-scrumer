$(function(){
	var section ={
			input : {
				member : $('#inputMember'),
				project : $('#inputProject')
			},
			 list : {
				 member : $('#listMember'),
				project : $('#listProject')
			}
	};
	var input = {
			name : {
				member :  section.input.member.find('input[name=memberName]'),
				project :  section.input.project.find('input[name=projectName]')
			}
	};
	var btn = {
			add : {
				member : $('#addMember'),
				project : $('#addProject'),
			},
			register : {
				member : section.input.member.find('.register'),
				project : section.input.project.find('.register')
			}
	};
	var createAddBtn = function(label){
		var icon = $('<i/>').addClass(' icon-plus-sign icon-white');
		return $('<a>').attr('href', 'javascript:void(false)').addClass('add').append(icon).append(label);
	};

	section.list.member.on('click', '.add', function(){
		section.input.member.show();
		var cover = $.doPageCover();
		cover.on('click' , function(){
			section.input.member.hide();
		});
	});
	section.list.project.on('click', '.add', function(){
		section.input.project.show();
		var cover = $.doPageCover();
		cover.on('click' , function(){
			section.input.project.hide();
		});
	});
	btn.register.member.on('click', function() {
		var members = $.fromLocalStrage(keys.member);
		if(!members) members = new Array();

		var name = input.name.member.val();
		members.push(name);
		 $.toLocalStrage(keys.member, members);
		 $('.cover').trigger('click');
		 input.name.member.val('');
		 section.list.member.trigger('list.refresh');
	});
	btn.register.project.on('click', function() {
		var projects = $.fromLocalStrage(keys.project);
		if(!projects) projects = new Array();

		var name = input.name.project.val();
		projects.push(name);
		$.toLocalStrage(keys.project, projects);
		$('.cover').trigger('click');
		input.name.project.val('');
		section.list.project.trigger('list.refresh');
	});

	section.list.member.on('list.refresh', function() {
		var detail = $(this).find('.detail').empty();
		var members = $.fromLocalStrage(keys.member);
		$.each(members, function(index) {
			detail.append($.createLabelWithIcon('icon-user', members[index]).addClass('span2'));
		});
		detail.append(createAddBtn('add member').addClass('span6'));
	}).trigger('list.refresh');

	section.list.project.on('list.refresh', function() {
		var detail = $(this).find('.detail').empty();
		var projects = $.fromLocalStrage(keys.project);
		$.each(projects, function(index) {
			detail.append($.createLabelWithIcon('icon-bookmark', projects[index]).addClass('span2'));
		});
		detail.append(createAddBtn('add project').addClass('span6'));
	}).trigger('list.refresh');
});