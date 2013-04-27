// MAIN of cloud.html
// for JQuery Mobile instead of $(document).ready
//$(document).bind('pageinit', function() {
//$(document).ready(function() {

// creazione dominio come insieme di nuvole (insiemi)
var dominio = [];

// creazione di 3 container
var containerOptions = ["chi", "cosa", "dove", "quando"];
createContainer(containerOptions);
createContainer(containerOptions);
createContainer(containerOptions);

// recupero dal database le persone che hanno partecipato a degli eventi
dominio["personepeventi"] = {
	name : "Persone partecipanti a degli eventi",
	elements : getJSON("data/pp.json"), // lettura campi da json generato in maniera random
	views : {
		"chi" : {// vista tabella
			type : "table",
			columns : ["immagine", "id", "nome", "idEvento"],
			id : "id",
			image : "immagine"

		},
		"cosa" : {// vista tabella
			type : "table",
			columns : ["idPersona", "nome", "idEvento"],
			id : "idPersona"
		},
		"dove" : {// vista mappa geografica
			type : "geomap",
			columns : ["idEvento", "lat", "lon", "nomeEvento"],
			id : "idEvento",
			name : "nomeEvento"
		},
		"quando" : {// vista mappa geografica
			type : "timeline",
			columns : ["idEvento", "nomeEvento", "start", "end"],
			id : "idEvento",
			name : "nomeEvento"
		}
	}
};

//console.log("personepeventi", dominio["personepeventi"].elements);

/* dominio["gruppoOrganizzato"] = {
 name : "Gruppo organizzato",
 elements : getJSON("data/gerarchia_gruppo_organizzato.json")
 }; */

initClouds('#clouds', dominio, {
	height : 150
});


var elementsUnique = dominio["personepeventi"].elements.removeDuplicates("idEvento");
var columns = dominio["personepeventi"].views["quando"].columns;
elementsUnique = elementsUnique.project(columns);

/*var t = new Timeline('view_container_body_0', 'idEvento', elementsUnique, {
	name : "nomeEvento"
});*/
//t.draw(elementsUnique); 

//createDraggableCloud('debug', dominio["personepeventi"]);

//});
