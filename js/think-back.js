;(function($){
	$.fn.extend({
			countChart : function(start, end){
				//TODO オブジェクトを使って処理する
				var year = '2012', month ='12';
				var container = $(this);
				var xData = new Array(), yData = new Array();
				var categories = new Array();

				for(var i=1 ;  i<=31 ; i++){
					var target = year + '/' + month + '/' + $.padZero(i);
					var  d = AS.selectDailyBug(target);
					if(d){
						xData.push(Number(d['total']));
						yData.push(Number(d['fixed']));
					}else{
						 xData.push(0);
						 yData.push(0);
					}
					categories.push($.padZero(i));
				};
				//x軸のラベル
				var categories = { categories: categories };
				//y軸のラベル
				var yAxisPrimary = {
						min: 0,
			            labels: {
			                formatter: function() { return this.value +'件'; },
			                style: { color: '#89A54E' }
			            },
			            title: {
			                text: '消化数',
			                style: { color: '#89A54E' }
			            }
			        },
			        yAxisSecondary = {
							min: 0, opposite: true,
			                title: {
			                    text: '総数',
			                    style: { color: '#4572A7' }
			                },
			                labels: {
			                    formatter: function() { return this.value +' 件'; },
			                    style: { color: '#4572A7' }
			                }
			            };
			    return new Highcharts.Chart({
			            chart: {
			                renderTo: container.attr('id'),
			                zoomType: 'xy'
			            },
			            title: { text: 'Total Bug' },
			            xAxis: [categories],
			            yAxis: [yAxisPrimary,  yAxisSecondary],
			            tooltip: {
			                formatter: function() { return this.series.name + ': ' +this.y + ' 件'; }
			            },
			            legend: {
			                layout: 'vertical', align: 'left', verticalAlign: 'top',
			                x: 100, y: 15,
			                floating: true,
			                backgroundColor: '#FFFFFF'
			            },
			            series: [{
			                name: '総数', color: '#4572A7',
			                type: 'column', data: xData,
			                yAxis: 1
			            }, {
			                name: '消化数', color: '#89A54E',
			                type: 'spline', data: yData
			            }]
			        });
			}
	});

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
		$('#count-container').countChart('2012/12/01',  '2012/12/31');
	});
})(jQuery);