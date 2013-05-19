// MAIN of cloud.html
// for JQuery Mobile instead of $(document).ready
//$(document).bind('pageinit', function() {
//$(document).ready(function() {

// creazione dominio come insieme di nuvole (insiemi)
var dominio = [];

// creazione di 3 container
var containerOptions = ["chi", "cosa", "dove", "quando"];
createContainer('views_container', containerOptions, "chi", 4);
createContainer('views_container2', containerOptions, "dove", 3);

// recupero dal database le persone che hanno partecipato a degli eventi
dominio["personepeventi"] = {
	name : "Persone partecipanti a degli eventi",
	elements : getJSON("data/pp.json"), // lettura campi da json generato in maniera random
	domain : "crimini"

};

initClouds('#clouds', dominio, {
	height : 150
});

//});
