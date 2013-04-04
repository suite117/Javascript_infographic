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

	var persone = getJSON("data/persone.json");

	var personeMap = {
		"Immagine" : [toHTMLImgTag, "image"],
		"id" : "id",
		"Nome" : "nome",
		"Data di nascita" : "datanascita"

	};

	dominio["persone"] = {
		type : TYPE.SET,
		elements : persone.map1(personeMap)
	};
	
	var personePartecipanti = getJSON("data/personapartecipante.json");
	
	dominio["persone-partecipanti"] = {
		type : TYPE.SET,
		elements : personePartecipanti.joinTable(persone, "idPersona", "id")
	};
	
	console.log("");

	var armi = getJSON("data/armi.json");

	dominio["armi"] = {
		type : TYPE.SET,
		elements : armi
	};

	var events = getJSON("data/events.json");

	dominio["eventi"] = {
		type : TYPE.GEOMAP,
		elements : events
	};

	var gerarchiaGruppoOrganizzato = getJSON("data/gerarchia_gruppo_organizzato.json");

	dominio["gruppoOrganizzato"] = {
		type : TYPE.TREE,
		elements : gerarchiaGruppoOrganizzato
	};

	initClouds('#viz', dominio);

});
