var baseUrl = "/Javascript_infographic/Tesi/WebContent/";

function getAge(dateString) {
	var today = new Date();
	var birthDate = new Date(dateString);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

function concatena(arguments) {

	var outText = "";
	for (var i = 0; i < arguments.length; i++) {
		outText += arguments[i] + " ";
	}

	return outText;
}

function toList(arguments) {
	return arguments;
}

function getJSON(url) {
	var data = (function() {
		var json = null;
		$.ajax({
			'async' : false,
			'global' : false,
			'url' : url,
			'dataType' : "json",
			'success' : function(data) {
				json = data;
			}
		});
		return json;
	})();
	
	return data;
}