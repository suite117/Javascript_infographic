// MAIN of cloud.html
// for JQuery Mobile instead of $(document).ready
$(document).bind('pageinit', function() {
	// $(document).ready(function() {

	// creazione dominio come insieme di nuvole (insiemi)
	var dominio = [];

	// creazione di 3 container
	var containerOptions = [ "chi", "dove", "quando" ];
	createContainer('values_generator', containerOptions, "chi", 1, {
		isGenerator : true,
		"data-input" : {
			"chi" : {
				domain : "crimini",
				elements : getJSON("/JSONServlet/RequestObject?element=chi")
			},
			"dove" : {
				domain : "crimini",
				elements : getJSON("/JSONServlet/RequestObject?element=dove")
			},
			"quando" : {
				domain : "crimini",
				elements : getJSON("/JSONServlet/RequestObject?element=quando")
			}
		}
	});

	createCloudGenerator('values_generator', containerOptions, 'crimini');
	createContainer('views_container', containerOptions, "chi", 4);
	createContainer('views_container2', containerOptions, "dove", 3);

	// recupero dal database le persone che hanno partecipato a degli eventi
	/*
	 * dominio["personepeventi"] = { name : "Persone partecipanti a degli
	 * eventi", elements : getJSON("data/pp.json"), // lettura campi da json
	 * generato in maniera random domain : "crimini" };
	 * 
	 * initClouds('#clouds', dominio, { height : 150 });
	 */

});
