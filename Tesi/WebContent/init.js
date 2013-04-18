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

	//var personePartecipanti = getJSON("data/personapartecipante.json");

	//var epj = events.joinTable(personePartecipanti, "id", "idEvento");

	//var personepeventi = persone.joinTable(epj, "id", "idPersona");

	dominio["personepeventi"] = {
		name : "Persone partecipanti a degli eventi",
		elements : getJSON("data/pp.json"), //personepeventi,
		views : {
			"table" : {columns:["id", "nome", "idEvento"]},
			"geomap" : {columns: ["idEvento", "lat", "lon", "nomeEvento"]}
		}
	};

	//console.log("personepeventi", dominio["personepeventi"].elements);

	 /* dominio["gruppoOrganizzato"] = {
		type : TYPE.TREE,
		elements : getJSON("data/gerarchia_gruppo_organizzato.json")
	}; */

	initClouds('#viz', dominio);

	//createDraggableCloud('debug', dominio["personepeventi"]);

});
