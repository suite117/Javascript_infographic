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

function listTodate(arguments) {
	var outText = "";
	for (var i = 0; i < arguments.length; i++) {
		outText += arguments[i] + "-";
	}
	
	return outText;
}

function toList(arguments) {
	return arguments;
}

function toHTMLImgTag(path) {
	return '<img src="' + path + '" style="width:100px; margin:0; padding: 0;"></img>';
}
