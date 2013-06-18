// MAIN dell'applicazione

// inclusione dei fogli di stile
// baseUrl definita nel file utils.js rappresenta la home directory dell'applizazione

// inclusione foli di stile

// $(document).ready(function() {
// for JQuery Mobile instead of $(document).ready
$(document).bind('pageinit', function() {
    /*
     * var cssList =
     * ["http://code.jquery.com/mobile/1.3.1/jquery.mobile-1.3.1.min.css",
     * "style.css" ]; for (var i = 0; i < cssList.length; i++) $('head').append(
     * $('<link rel="stylesheet" type="text/css" />').attr('href', cssList[i]) );
     */
    $("#legend").draggable();
    
    
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

    // recupero dal database le persone che hanno partecipato a
    // degli eventi
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
