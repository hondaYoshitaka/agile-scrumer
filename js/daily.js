;$(function() {
	// 画面要素の宣言
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
	};
	var pairList = $('#pairing').find('.pairList');

	// Daily関連のfunction
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
	var setBugs = function(bugs) {
		$('input[name=total]').val(bugs.total);
		$('input[name=fixed]').val(bugs.fixed);
		$('input[name=increase]').val(bugs.increase);
	};
	var setWorker = function(pairs) {
		$('#worker').find('input[type=checkbox]').removeAttr('checked');
		for(var key in pairs){
			$.each(pairs[key].members, function(index){
				var val = pairs[key].members[index];
				$('#worker').find('input[value='+ val +']').trigger('click');
			});
		}
	};
	var setPair = function(pairs) {

	};

	/** メンバーリスト */
	$('#worker').find('.memberList').on('change', 'input[type=checkbox]', function() {
		// すべてを初期化する
		labelingPairCount();
		pairList.trigger('list.refresh');
	});

	/** タスクに入れる人 */
	$('#worker').on('list.refresh', function() {
		var members = $.fromLocalStrage(keys.member);
		$.each(members, function(index) {
			var span = $('<span/>').addClass('span2')
								.append($.createCheckbox(members[index], members[index]));
			div.memberList.append(span);
		});
		labelingPairCount();
		pairList.trigger('list.refresh');
	}).trigger('list.refresh');

	/** ペア決め */
	pairList.on('list.refresh',function(){
		pairList.empty();
		for(var i=1 ; i <= countPair() ; i++){
			var projects = $.fromLocalStrage(keys.project);
			var select = $.createSelectbox(projects);

			var icon = $('<i/>').addClass('  icon-ok');
			var pairDiv = $('<div/>').addClass('span3 pair').attr('data-pair-id', i);
			var inner = $('<div/>').addClass('inner')
										.append(icon).append(' pair '+i).append(select)
										.appendTo(pairDiv);
			pairList.append(pairDiv);
		}
	}).trigger('list.refresh');

	/** シャッフルボタン */
	$('#pairing').find('.shuffle').on('click', function(){
		pairList.trigger('list.refresh');
		var members = getCheckedMembers();
		members.shuffle();

		var pairDiv = pairList.find('div.pair[data-pair-id]');
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

	/** 保存ボタン */
	$('#save').on('click', function(){
		var record = {
				pairs: {},
				bugs: {}
		};
		//ペアの情報を詰める
		pairList.find('.pair').each(function(){
			var pair = $(this);
			var pairId = pair.data('pair-id');
			var members = new Array();
			pair.find('.member').each(function() {
				var name = $(this).text();
				members.push(name);
			});
			record.pairs['pair'+pairId] =  {
					members: members,
					project: pair.find('select>option:checked').val()
			};
		});
		//バグの情報をつめる
		record.bugs = {
				total: $('input[name=total]').val(),
				fixed: $('input[name=fixed]').val(),
				increase: $('input[name=increase]').val()
			};
		$.saveDailyRecord($("#taskDate").val(), record);
	});

	/** Dailyのレコードをロードする */
	$("#taskDate").on('record.load', function(){
		var taskDate = $(this);
		var  loadedRecord = $.selectDailyRecord(taskDate.val());
		if(loadedRecord){
			setBugs(loadedRecord.bugs);
			setWorker(loadedRecord.pairs);
			setPair(loadedRecord.pairs);
		}else{
			// すべてを初期化する
			labelingPairCount();
			pairList.trigger('list.refresh');
		}
	});

	/** datepicker */
	$('#datepicker').datepicker({
	    onSelect: function(dateText, inst) {
	    	$('.dateLabel').text(dateText);
	        $("#taskDate").val(dateText).trigger('record.load');
	    }
	});

	// デフォルト表示を現在日付にする
	$('.dateLabel').text($.getCurrentDate());
	$("#taskDate").val($.getCurrentDate()).trigger('record.load');
});