var tassonomia_eventi = [ {
	"id" : 0,
	"nome" : "evento",
	"id-padre" : null
}, {
	"id" : 1,
	"nome" : "reato",
	"id-padre" : 0
}, {
	"id" : 2,
	"nome" : "omicidio",
	"id-padre" : 1
}, {
	"id" : 3,
	"nome" : "premeditato",
	"id-padre" : 2
} ];

var persone = [ {
	"id" : 1,
	"nome" : "Mario",
	"cognome" : "Rossi",
	"data_nascita" : "10/10/1950"
}, {
	"id" : 2,
	"nome" : "Paolo",
	"cognome" : "Rossi",
	"data_nascita" : "10/10/2000"
} ];

var dominio = {
	"persone" : persone,
	"eventi" : tassonomia_eventi
};


