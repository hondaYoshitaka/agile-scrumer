;$.extend({
	doPageCover : function(){
		 return $('<div/>').on('click', function(){
			$(this).remove();
		}).appendTo('body').addClass('cover');
	},
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
			checked: 'checked',
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

var keys = {
		member : 'member',
		project : 'project'
};
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