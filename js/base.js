;$.extend({
	toLocalStrage: function(key, object) {
		var str = JSON.stringify(object);
		localStorage.setItem(key,str);
	},
	fromLocalStrage: function(key) {
		var object = localStorage.getItem(key);
		return JSON.parse(object);
	},
	createLabelWithIcon : function(icon, label) {
		var iconTag = $('<i/>').addClass(icon);
		return $('<span>').append(iconTag).append(label);
	},
	createCheckbox : function(label, value) {
		var labelTag = $('<label/>').addClass('checkbox inline');
		var checkbox = $('<input/>').attr({
			type : 'checkbox',
			value : value
		});
		return labelTag.append(checkbox).append(label);
	},
	createSelectbox : function(array) {
		var select = $('<select/>').append('<option/>');
		for(var i = 0 ; i < array.length ; i++){
			var option = $('<option/>').val(array[i]).text(array[i]);
			select.append(option);
		}
		return select;
	},
	padZero : function (num) {
		var result;
		if (num < 10) {
			result = "0" + num;
		} else {
			result = "" + num;
		}
		return result;
	},
	getCurrentDate : function(){
		var current = new Date();
		return current.getFullYear() + "/" + $.padZero(current.getMonth()+1) + "/" + $.padZero(current.getDate());
	}
});

$.fn.extend({

});

/** 配列をシャッフルする */
Array.prototype.shuffle = function() {
	var i = this.length;
	while (i) {
		var j = Math.floor(Math.random() * i);
		var t = this[--i];
		this[i] = this[j];
		this[j] = t;
	}
	return this;
};

/** 業務共通の処理 */
AS = {};
AS = {
	/** ローカルストレージのキー */
	keys: {
		member: 'member',
		project: 'project',
		assignableMember: 'assignableMember',
		pair: 'pair',
		bug: 'bug'
	},
	saveDailyData: function(date, record, strageKey){
		var records = $.fromLocalStrage(strageKey);
		if(!records) records = {};

		records[date]= record;
		$.toLocalStrage(strageKey, records);
		return;
	},
	saveDailyPair : function(date, record){
		AS.saveDailyData(date,record,AS.keys.pair);
		return;
	},
	saveDailyBug : function(date, record){
		AS.saveDailyData(date,record,AS.keys.bug);
		return;
	},
	saveDailyAssignableMember : function(date, record){
		AS.saveDailyData(date,record,AS.keys.assignableMember);
		return;
	},
	selectDailyData: function(date, strageKey) {
		var records = $.fromLocalStrage(strageKey);
		if(!records) return;
		return records[date];
	},
	findAllMember: function(date){
		return $.fromLocalStrage(AS.keys.member);
	},
	findAllProject: function(date){
		return $.fromLocalStrage(AS.keys.project);
	},
	selectDailyPair: function(date){
		return AS.selectDailyData(date,AS.keys.pair);
	},
	selectDailyBug: function(date){
		return AS.selectDailyData(date,AS.keys.bug);
	},
	selectDailyAssignableMember: function(date){
		return AS.selectDailyData(date,AS.keys.assignableMember);
	}
};
