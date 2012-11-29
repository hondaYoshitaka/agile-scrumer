;$(function() {
	var section = {
			worker : $('#worker'),
			project : $('#assignProject'),
			daily : $('#daily'),
			pairing : $('#pairing')
	};
	var div = {
			memberList : section.worker.find('.memberList'),
			assignList : section.project.find('.assignList'),
			pairNumber : section.worker.find('.pair'),
			pairList : section.pairing.find('.pairList')
	};
	var btn = {
			shuffle : section.pairing.find('.shuffle')
	};
	var table = {
			dailyRecord : $('#dailyRecord')
	};

	var getCheckedMembers = function() {
		var result = new Array();
		var assignableMember = div.memberList.find('input[type=checkbox]:checked');
		assignableMember.each(function() {
			var checkbox = $(this);
			result.push(checkbox.val());
		});
		return result;
	};
	var countPair = function() {
		return  div.memberList.find('input[type=checkbox]:checked').size() /2;
	};
	var labelingPairCount = function() {
		div.pairNumber.find('.pairCount').text(countPair);
	};

	/** メンバーリスト */
	div.memberList.on('change', 'input[type=checkbox]', function() {
		// すべてを初期化する
		labelingPairCount();
		div.pairList.trigger('list.refresh');
	});

	/** タスクに入れる人 */
	section.worker.on('list.refresh', function() {
		var members = $.fromLocalStrage(keys.member);
		$.each(members, function(index) {
			var span = $('<span/>').addClass('span2')
								.append($.createCheckbox(members[index], members[index]));
			div.memberList.append(span);
		});
		labelingPairCount();
		div.pairList.trigger('list.refresh');
	}).trigger('list.refresh');

	/** ペア決め */
	div.pairList.on('list.refresh',function(){
		div.pairList.empty();
		for(var i=1 ; i <= countPair() ; i++){
			var projects = $.fromLocalStrage(keys.project);
			var select = $.createSelectbox(projects);

			var icon = $('<i/>').addClass('  icon-ok');
			var pairDiv = $('<div/>').addClass('span3 pair').attr('data-pair-id', i);
			var inner = $('<div/>').addClass('inner')
										.append(icon).append(' pair '+i).append(select)
										.appendTo(pairDiv);
			div.pairList.append(pairDiv);
		}
	}).trigger('list.refresh');

	/** メンバー管理ボタン */
	$('#setWorker').on('click', function(){
		$('#worker').show();
		var cover = $.doPageCover();
		cover.on('click' , function(){
			$('#worker').hide();
		});
	});

	/** 実績の記入ボタン */
	$('#record').on('click', function(){
		$('#recordDaily').show();
		var cover = $.doPageCover();
		cover.on('click' , function(){
			$('#recordDaily').hide();
		});
	});

	/** シャッフルボタン */
	btn.shuffle.on('click', function(){
		div.pairList.trigger('list.refresh');
		var members = getCheckedMembers();
		members.shuffle();

		var pairDiv = div.pairList.find('div.pair[data-pair-id]');
		pairDiv.each(function() {
			// 奇数の場合、1ペア3人とする
			var max_member_num = (members.length % 2 == 1) ? 3 : 2;
			var pd = $(this);
			for(var i=0; i < max_member_num ;i++){
				var member = members.pop(members[0]);
				var p = $('<p/>').addClass('member').append(member);
				pd.find('.inner').append(p);
			}
		});
	});

	/** レコードテーブル */
	table.dailyRecord.on('table.refresh', function() {
		//FIXME 暫定的にinputを埋めている。
		var createTd = function() {
			var input = $('<input/>').attr('type','number').addClass('input-mini');
			return $('<td/>').append(input);
		};
		var dailyTable = $(this);
		var tbody = $('<tbody/>');
		for(var i=1 ; i <= countPair() ; i++){
			var tr = $('<tr/>');
			var td = $('<td/>').append('pair ' +i);
			tr.append(td);
			tr.append(createTd()).append(createTd());
			tbody.append(tr);
		}
		dailyTable.append(tbody);
	}).trigger('table.refresh');

	$('#save').on('click', function(){

	});

	/** datepicker */
	$('#datepicker').datepicker({
	    onSelect: function(dateText, inst) {
	    	$('.dateLabel').text(dateText);
	        $("#taskDate").val(dateText);
	    }
	});

	// デフォルト表示を現在日付にする
	$('.dateLabel').text($.getCurrentDate());
	$("#taskDate").val($.getCurrentDate());
});