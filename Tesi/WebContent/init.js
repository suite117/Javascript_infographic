var TYPE = {
	TABLE : "table",
	TREE : "tree",
	GEOMAP : "geomap"

}

// MAIN of cloud.html
// for JQuery Mobile instead of $(document).ready()
$(document).bind('pageinit', function() {

	// creazione dominio come insieme di nuvole (insiemi)
	var dominio = [];

	// creazione di 3 container
	createContainer();
	createContainer();
	createContainer();

	// recupero dal database le persone che hanno partecipato a degli eventi
	dominio["personepeventi"] = {
		name : "Persone partecipanti a degli eventi",
		elements : getJSON("data/pp.json"), // lettura campi da json generato in maniera random
		views : {
			"table" : { // vista tabella
				columns : ["id", "nome", "idEvento"],
				id : "id"
			},
			"geomap" : { // vista mappa geografica
				columns : ["idEvento", "lat", "lon", "nomeEvento"],
				id : "idEvento"
			}
		}
	};

	//console.log("personepeventi", dominio["personepeventi"].elements);

	/* dominio["gruppoOrganizzato"] = {
	 type : TYPE.TREE,
	 elements : getJSON("data/gerarchia_gruppo_organizzato.json")
	 }; */

	initClouds('#clouds', dominio);

	//createDraggableCloud('debug', dominio["personepeventi"]);

});
