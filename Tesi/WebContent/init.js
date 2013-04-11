var TYPE = {
	TABLE : "table",
	TREE : "tree",
	GEOMAP : "geomap"

}

// MAIN of cloud.html
// for JQuery Mobile instead of $(document).ready()
$(document).bind('pageinit', function() {

	var dominio = [];
	var relazioni = [];

	createContainer();
	createContainer();
	createContainer();

	var events = getJSON("data/events.json");

	dominio["eventi"] = {
		name : "evento",
		type : TYPE.GEOMAP,
		elements : events
	};

	dominio["eventi2"] = {
		type : TYPE.GEOMAP,
		elements : getJSON("data/events2.json")
	};

	var persone = getJSON("data/persone.json");

	var personeMap = {
		"image" : "image", //[toHTMLImgTag, "image"],
		"id" : "id",
		"Nome" : "nome",
		"Data di nascita" : "datanascita"

	};

	var persone = persone.map1(personeMap);

	var personePartecipanti = getJSON("data/personapartecipante.json");

	var epj = events.joinTable(personePartecipanti, "id", "idEvento");

	var personepeventi = persone.joinTable(epj, "id", "idPersona");
	
	
	console.log("personepeventi",personepeventi);

	dominio["personepeventi"] = {
		elements : personepeventi,
		views : {"table": ["idPersona", "id", "Nome", "idEvento"], "geomap" : ["idEvento"]}
	};

	dominio["gruppoOrganizzato"] = {
		type : TYPE.TREE,
		elements : getJSON("data/gerarchia_gruppo_organizzato.json")
	};

	initClouds('#viz', dominio);

});
