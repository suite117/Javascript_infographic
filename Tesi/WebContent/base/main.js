if (typeof jQuery == 'undefined')
	alert("jQuery Non Found!.");

$(document).ready(function() {

});

var mapping = {
	"id" : "id",
	"Nome e Cognome" : [ concatena, [ "nome", "cognome" ] ],
	"età" : [ getAge, "data_nascita" ]
};

// crea un oggetto identico al primo
var mapping2 = {
	"id" : "id",
	"nome" : "nome",
	"cognome" : "cognome",
	"data_nascita" : "data_nascita"
};

document.writeln("Input <br />");
dominio.persone.print();

document.writeln("Output <br />");
dominio.persone.map(mapping).printTable();

document.writeln("<br />Input <br />");
var p2 = dominio.persone.map(mapping2);
p2.print();

document.writeln("<br />Output: <br />");
dominio.persone.printTable();
document.writeln("Distanza: " + p2.distance(dominio.persone));
