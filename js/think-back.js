;(function($){
	$.fn.extend({
			viewDailyBugChart : function(start, end){
				var container = $(this);
				var startDate = new ASDate(start),
					  endDate = new ASDate(end);
				var notouchData = new Array(), fixedData = new Array(), completeData = new Array();
				var categories = new Array();

				if(startDate.comparedTo(endDate) == -1) return null;
				for(var i=0 ; ; i++){
					var target = startDate.addDays(i);
					var target_data = AS.selectDailyBug(target.toString());
					var total = target_data ? Number(target_data['total']) : 0 ,
						  fixed = target_data ? Number(target_data['fixed']) : 0 ,
						  complete = target_data ? Number(target_data['complete']) : 0 ;
					notouchData.push(total - (fixed+complete));
					fixedData.push(fixed);
					completeData.push(complete);
					categories.push(target.month+'/'+target.day);
					if(target.comparedTo(endDate) == 0) break;
				}
				//x軸のラベル
				var categories = { categories: categories };
				//y軸のラベル
				var yAxis = {
						min: 0,
			            title: {
			                text: '総件数',
			                style: { color: '#89A54E' }
			            },
			            stackLabels: {
		                    enabled: true,
		                    style: {
		                        fontWeight: 'bold',
		                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
		                    }
		                }
			            };
			    return new Highcharts.Chart({
			            chart: {
			                renderTo: container.attr('id'),
			                type: 'column'
			            },
			            title: { text: 'Total Bug' },
			            xAxis: [categories],
			            yAxis: [yAxis],
			            tooltip: {
			                formatter: function() {
			                    return '<b>'+ this.x +'</b><br/>'+
			                        this.series.name +': '+ this.y +'件<br/>'+
			                        'Total: '+ this.point.stackTotal+'件';
			                }
			            },
			            plotOptions: {
			                column: {
			                    stacking: 'normal',
			                    dataLabels: {
			                        enabled: true,
			                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white'
			                    }
			                }
			            },
			            legend: {
			            	align: 'right', verticalAlign: 'top',
			                x: -100, y: 20, borderWidth: 1,
			                borderColor: '#CCC',
			                floating: true, shadow: false,
			                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white'
			            },
			            series: [{
			                name: '未着手', data: notouchData
			            }, {
			                name: '修正済', data: fixedData
			            }, {
			                name: '完了', data: completeData
			            }]
			        });
			},
			viewIncreaseFinishingChart: function(start, end){
				var container = $(this);
				var startDate = new ASDate(start),
					  endDate = new ASDate(end);
				var increaseData = new Array(), finishingData = new Array();
				var categories = new Array();

				if(startDate.comparedTo(endDate) != 1) return null;
				// Sprint初日は増加数と消化数の対象に含めない
				increaseData.push(0);
				finishingData.push(0);
				categories.push(startDate.month+'/'+startDate.day);
				for(var i=1 ; ; i++){
					var target = startDate.addDays(i),
						  before = startDate.addDays(i-1);
					var target_data = AS.selectDailyBug(target.toString()),
						  before_data = AS.selectDailyBug(before.toString());
					var total = target_data ? Number(target_data['total']) : 0 ,
						  fixed = target_data ? Number(target_data['fixed']) : 0 ,
						  complete = target_data ? Number(target_data['complete']) : 0 ,
						  before_total = before_data ? Number(before_data['total']) : 0 ,
						  before_fixed = before_data ? Number(before_data['fixed']) : 0 ,
						  before_complete = before_data ? Number(before_data['complete']) : 0 ;
					increaseData.push(total - before_total);
					finishingData.push((fixed+complete) - (before_fixed+before_complete));
					categories.push(target.month+'/'+target.day);
					if(target.comparedTo(endDate) == 0) break;
				}
				//x軸のラベル
				var categories = { categories: categories };
				//y軸のラベル
				var yAxis = {
						min: 0,
			            title: {
			                text: '総件数',
			                style: { color: '#89A54E' }
			            },
			            stackLabels: {
		                    enabled: true,
		                    style: {
		                        fontWeight: 'bold',
		                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
		                    }
		                }
			            };
			    return new Highcharts.Chart({
			            chart: {
			                renderTo: container.attr('id'),
			                type: 'column'
			            },
			            title: { text: 'Increase and Finishing Bug' },
			            xAxis: [categories],
			            yAxis: [yAxis],
			            tooltip: {
			                formatter: function() {
			                    return '<b>'+ this.x +'</b><br/>'+
			                        this.series.name +': '+ this.y +'件';
			                }
			            },
			            plotOptions: {
			            	column: {
			                    pointPadding: 0.2,
			                    borderWidth: 0
			                }
			            },
			            legend: {
			            	align: 'right', verticalAlign: 'top',
			                x: -100, y: 20, borderWidth: 1,
			                borderColor: '#CCC',
			                floating: true, shadow: false,
			                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColorSolid) || 'white'
			            },
			            series: [{
			                name: '増加', data: increaseData, color: '#b22'
			            }, {
			                name: '消化', data: finishingData
			            }]
			        });
			}
	});

	$.extend({
		averageIncreaseBug : function(start, end) {
			var startDate = new ASDate(start),
			  endDate = new ASDate(end);
			var average = 0;

			if(startDate.comparedTo(endDate) != 1) return 0;
			for(var i=1 ; ; i++){
				var target = startDate.addDays(i),
					  before = startDate.addDays(i-1);
				var target_data = AS.selectDailyBug(target.toString()),
					  before_data = AS.selectDailyBug(before.toString());
				var total = target_data ? Number(target_data['total']) : 0 ,
					  before_total = before_data ? Number(before_data['total']) : 0 ;
				var increase = (total - before_total);
				average +=increase;
				if(target.comparedTo(endDate) == 0) {
					return Math.floor(average*100 / i)/100;
				}
			}
		},
		averageFinishingBug : function(start, end) {
			var startDate = new ASDate(start),
			  endDate = new ASDate(end);
			var average = 0;

			if(startDate.comparedTo(endDate) != 1) return 0;
			for(var i=1 ; ; i++){
				var target = startDate.addDays(i),
					  before = startDate.addDays(i-1);
				var target_data = AS.selectDailyBug(target.toString()),
					  before_data = AS.selectDailyBug(before.toString());
				var fixed = target_data ? Number(target_data['fixed']) : 0 ,
					  complete = target_data ? Number(target_data['complete']) : 0 ,
					  before_fixed = before_data ? Number(before_data['fixed']) : 0 ,
					  before_complete = before_data ? Number(before_data['complete']) : 0 ;
				var finishing = ((fixed+complete) - (before_fixed+before_complete));
				average +=finishing;
				if(target.comparedTo(endDate) == 0) {
					return Math.floor(average*100 / i)/100;
				}
			}
		}
	});

	$(function(){
		var input_start = $('input[name=startDate]').datepicker({
		    onSelect: function(dateText, inst) {
				$('#average-area').trigger('label.refresh');
		    	$('.nav-list').find('.active a').trigger('click');
		    }
		}).val($.getCurrentDate()),
		input_end = $('input[name=endDate]').datepicker({
		    onSelect: function(dateText, inst) {
				$('#average-area').trigger('label.refresh');
		    	$('.nav-list').find('.active a').trigger('click');
		    }
		}).val($.getCurrentDate());

		/** タブのイベント */
		$('.nav-list').find('li').each(function(){
			var li = $(this);
			li.find('a').on('click', function() {
				var a = $(this);
				a.tab('show').trigger('chart.show');
				// navのtabを選択状態にする
				$('.nav-list').find('li').removeClass('active');
				li.addClass('active');
			});
		});

		$("a[href='#daily-bug']").on('chart.show', function(){
			var start = input_start.val(), end = input_end.val();
			$('#count-container').viewDailyBugChart(start,  end);
		});
		$("a[href='#increase-finishing']").on('chart.show', function(){
			var start = input_start.val(), end = input_end.val();
			$('#increase-finishing-container').viewIncreaseFinishingChart(start,  end);
		});
		$('#average-area').on('label.refresh', function() {
			var area = $(this);
			var start = input_start.val(), end = input_end.val();
			var aveIncrease = $.averageIncreaseBug(start, end),
				  aveFinishing = $.averageFinishingBug(start, end),
				  totalScore = Math.floor((aveFinishing - aveIncrease)*100) / 100;
			area.find('.increase-score').text(aveIncrease);
			area.find('.finishing-score').text(aveFinishing);
			area.find('.total-score').text(totalScore);
		});
		// 予め、navの最初のリンクを押しておく
		$('.nav-list').find('a:first').trigger('click');
	});
})(jQuery);