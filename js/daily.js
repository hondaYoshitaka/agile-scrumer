;(function($){
	$.extend({
		getCheckedMembers: function() {
			var result = new Array();
			var memberList = $('#worker').find('.memberList'),
				assignableMember = memberList.find('input[type=checkbox]:checked');
			assignableMember.each(function() {
				var checkbox = $(this);
				result.push(checkbox.val());
			});
			return result;
		},
		countPair: function() {
			var memberList = $('#worker').find('.memberList');
			return  memberList.find('input[type=checkbox]:checked').size() /2;
		},
		labelingPairCount: function() {
			$('#worker').find('.pairCount').text($.countPair);
		},
		setRecordResult: function(bugs) {
			if(!bugs){
				$('#recordResult').find('input').val('');
				return;
			}
			$.each(['total','fixed','increase'],function(i, name){
				$('input[name=' + name + ']').val(bugs[name]);
			});
		},
		setWorker: function(worker) {
			$('#worker').find('input[type=checkbox]').removeAttr('checked');
			$.each(worker, function(index, value){
				$('#worker').find('input[value='+ value +']').trigger('click');
			});
		},
		setPair: function(pairs) {
			return;
		}
	});

	$(function() {
		var memberList = $('#worker').find('.memberList');
		var pairList = $('#pairing').find('.pairList');

		/** メンバーリスト */
		memberList.on('change', 'input[type=checkbox]', function() {
			// すべてを初期化する
			$.labelingPairCount();
			pairList.trigger('list.refresh');
		});

		/** 実績リスト */
		$('#teamRecord').find('table').on('table.refresh', function(){
			var table = $(this);
			$.each(['total', 'fixed', 'increase'],function(index, name){
				var value = $('#recordResult').find('input[name=' + name + ']').val(),
					td = table.find('.' + name + ' > td');
				if (value) {
					td.text(value + ' 件');
				}else{
					td.text('-');
				}
			});
			var fixedCnt = $('#recordResult').find('input[name=fixed]').val(),
				perPair = Math.round(fixedCnt * 10 / $.countPair()) / 10;
			table.find('.fixedPerPair > td').text(perPair + ' 件');
		});

		/** タスクに入れる人 */
		$('#worker').on('list.refresh', function() {
			var members = AS.findAllMember();
			$.each(members, function(index) {
				var label = members[index],
					value = members[index],
					checkboxs = $.createCheckbox(label, value);
				var span = $('<span/>').addClass('span2').append(checkboxs);
				memberList.append(span);
			});
			$.labelingPairCount();
			pairList.trigger('list.refresh');
		}).trigger('list.refresh');

		/** ペア決め */
		pairList.on('list.refresh',function(){
			pairList.empty();
			for(var i=1 ; i <= $.countPair() ; i++){
				var projects = AS.findAllProject();
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
			var btn = $(this);
			pairList.trigger('list.refresh');
			var members = $.getCheckedMembers();
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
			btn.trigger('pair.save');

		}).on('pair.save', function(){
			var record = {};
			pairList.find('.pair').each(function(){
				var pair = $(this);
				var pairId = pair.data('pair-id');
				var members = new Array();
				pair.find('.member').each(function() {
					var name = $(this).text();
					members.push(name);
				});
				record['pair'+pairId] =  {
						members: members,
						project: pair.find('select > :checked').val()
				};
			});
			console.log(record);
			AS.saveDailyPair($("#taskDate").val(), record);
		});

		/** 実績の保存ボタン */
		$('#recordResult').find('.save').on('click', function(){
			//バグの情報をつめる
			var record = {
					total: $('input[name=total]').val(),
					fixed: $('input[name=fixed]').val(),
					increase: $('input[name=increase]').val()
				};
			AS.saveDailyBug($("#taskDate").val(), record);
			$('#teamRecord').find('table').trigger('table.refresh')
		});
		/** workerの保存ボタン */
		$('#worker').find('.save').on('click', function(){
			var record = new Array();
			memberList.find(':checked').each(function(){
				var input = $(this);
				record.push(input.val());
			});
			AS.saveDailyAssignableMember($("#taskDate").val(), record);
		});

		/** Dailyのレコードをロードする */
		$("#taskDate").on('record.load', function(){
			var dateVal = $(this).val();
			console.log('◆Load ' + dateVal + ' Record...');

			// bugのデータをロードする
			var bugs = AS.selectDailyBug(dateVal);
			$.setRecordResult(bugs);
			console.log(bugs);

			// workerのデータをロードする
			var worker = AS.selectDailyAssignableMember(dateVal);
			if(worker){
				$.setWorker(worker);
			}
			console.log(worker);

			// pairのデータをロードする
			var pairs = AS.selectDailyPair(dateVal);
			console.log(pairs);

			$('#teamRecord').find('table').trigger('table.refresh');
		});

		/** datepicker */
		var datepicker = $('#datepicker').datepicker({
		    onSelect: function(dateText, inst) {
		    	$('.dateLabel').text(dateText);
		        $("#taskDate").val(dateText).trigger('record.load');
		    }
		});

		// デフォルト表示を現在日付にする
		$('.dateLabel').text($.getCurrentDate());
		$("#taskDate").val($.getCurrentDate()).trigger('record.load');
	});
})(jQuery);