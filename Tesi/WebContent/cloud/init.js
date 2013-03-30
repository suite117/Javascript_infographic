var TYPE = {
	SET : "set",
	TREE : "tree",
	GEOMAP : "geomap"
	
}

// MAIN di cloud.html

$(document).ready(function() {

	var dominio = [];

	createContainer();
	createContainer();
	createContainer();

	var persone = getJSON("persone.json");

	dominio["persone"] = {
		type : TYPE.SET,
		elements : persone
	};

	var armi = getJSON("armi.json");

	dominio["armi"] = {
		elements : armi
	};
	initClouds('#viz', dominio);

});
