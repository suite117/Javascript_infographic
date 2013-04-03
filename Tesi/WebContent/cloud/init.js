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
	createContainer();

	var persone = getJSON("../data/persone.json");

	var personeMap = {
		"id" : "id",
		"nome" : "nome",
		"data di nascita" : "datanascita"
	};

	dominio["persone"] = {
		type : TYPE.SET,
		elements : persone.map1(personeMap)
	};

	var armi = getJSON("../data/armi.json");

	dominio["armi"] = {
		type : TYPE.SET,
		elements : armi
	};

	var events = getJSON("../data/events.json");
	
	var geoMapping = {
					"id" : "id",
					"name" : [concatena, "startTime", "startTime"],
					"coordinates" : [toList, "lat", "lon"]
				}
				
	
	dominio["eventi"] = {
		type : TYPE.GEOMAP,
		elements : events
	};
	
	var gerarchiaGruppoOrganizzato = getJSON("../data/gerarchia_gruppo_organizzato.json");

	dominio["gruppoOrganizzato"] = {
		type : TYPE.TREE,
		elements : gerarchiaGruppoOrganizzato
	};

	initClouds('#viz', dominio);

});
