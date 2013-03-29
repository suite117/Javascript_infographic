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
