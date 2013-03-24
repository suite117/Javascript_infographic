// Estensione della classe array
Array.prototype.printTable = function() {
	var outText = "";
	var tHead = new Array();
	var tagTBody = new Array();

	for ( var key in this[0]) {
		if (!isFunction(this[0][key]))
			tHead.push("<th>" + key + "</th>");
	}

	for ( var i = 0; i < this.length; i++) {
		if (!isFunction(this[i]) && tagTBody[i] == null) {
			tagTBody[i] = new Array();
			for ( var key in this[i]) {
				if (!isFunction(this[i][key])) {
					tagTBody[i].push("<td>" + this[i][key] + "</td>");
				}
			}
		}
	}

	outText += '<table class="sortable"><thead><tr>' + tHead.join("")
			+ '</tr></thead><tbody>';

	for (index in tagTBody) {
		if (!isFunction(tagTBody[index]))
			outText += "<tr>" + tagTBody[index] + "</tr>";

	}

	outText += "</tbody></table>";
	document.writeln(outText);

	return;
};

// Stampa l'oggetto per funzioni di debug
Array.prototype.print = function() {

	//document.writeln("Instanceof: " + (this));
	var outText = "<p>" + JSON.stringify(this) + "</p>";

	document.writeln(outText);

	return outText;
};

// Mapping di un oggetto ad un altro oggetto con applicazione di eventuali
// funzioni
Array.prototype.map = function(mapping) {

	var outArr = new Array();
	for (i in this) {
		if (!isFunction(this[i]))
			outArr[i] = createObjfromObj(this[i], mapping);
	}

	return outArr;
};


// verifica se sono uguali
Array.prototype.compareTo = function(testArr) {
	if (this.length != testArr.length)
		return false;

	for ( var i = 0; i < this.length; i++) {
		if (!isFunction(this[i])) {
			for ( var key in this[i]) {
				if (!isFunction(this[i][key])) {
					// Se uno dei due campi è nullo
					// oppure hanno un'etichetta diversa
					// oppure hanno un valore diverso ma con la stessa etichetta
					if (testArr[i][key] == null
							|| this[i][key] != testArr[i][key])
						return false;
				}
			}
		}
	}

	return true;
};

// Distanza tra due insiemi
Array.prototype.distance = function(testArr) {
	if (this.compareTo(testArr)) // se sono lo stesso insieme
		return 0;
	else
		return 1;

};

Array.prototype.append = function(array) {
	this.push.apply(this, array)
};
