// MAIN of cloud.html
// $(document).ready(function() {
// for JQuery Mobile instead of $(document).ready
$(document).bind('pageinit', function() {
	

	// creazione di 3 container
	var generatorOptions = [ "persone", "luoghi", "tempi" ];
	createContainer('values_generator', generatorOptions, "persone", 1, {
		isGenerator : true,
		domain : "general",
		"data-input" : {
			"persone" : {
				domain : "general",
				elements : getJSON("/JSONServlet/RequestObject?element=persone")
			},
			"luoghi" : {
				domain : "general",
				elements : getJSON("/JSONServlet/RequestObject?element=luoghi")
			},
			"tempi" : {
				domain : "general",
				elements : getJSON("/JSONServlet/RequestObject?element=tempi")
			}
		}
	});

	
	
	var containerOptions = [ "chi", "dove", "quando" ];
	createContainer('views_container', containerOptions, "chi", 4);
	createContainer('views_container2', containerOptions, "dove", 3);

	// recupero dal database le persone che hanno partecipato a degli eventi
	/*
	 * // creazione dominio come insieme di nuvole (insiemi) var dominio = [];
	 * 
	 * 
	 * dominio["personepeventi"] = { name : "Persone partecipanti a degli
	 * eventi", elements : getJSON("data/pp.json"), // lettura campi da json
	 * generato in maniera random domain : "crimini" };
	 * 
	 * initClouds('#clouds', dominio, { height : 150 });
	 */

});
