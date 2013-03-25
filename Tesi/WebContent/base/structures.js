// Estensione della classe array
Array.prototype.printTable = function() {
	var outText = "";
	var tHead = new Array();
	var tagTBody = new Array();

	for (var key in this[0]) {
		if (!isFunction(this[0][key]))
			tHead.push("<th>" + key + "</th>");
	}

	for (var i = 0; i < this.length; i++) {
		if (!isFunction(this[i]) && tagTBody[i] == null) {
			tagTBody[i] = new Array();
			for (var key in this[i]) {
				if (!isFunction(this[i][key])) {
					tagTBody[i].push("<td>" + this[i][key] + "</td>");
				}
			}
		}
	}

	outText += '<table class="sortable"><thead><tr>' + tHead.join("") + '</tr></thead><tbody>';

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

	for (var i = 0; i < this.length; i++) {
		if (!isFunction(this[i])) {
			for (var key in this[i]) {
				if (!isFunction(this[i][key])) {
					// Se uno dei due campi è nullo
					// oppure hanno un'etichetta diversa
					// oppure hanno un valore diverso ma con la stessa etichetta
					if (testArr[i][key] == null || this[i][key] != testArr[i][key])
						return false;
				}
			}
		}
	}

	return true;
};

// Distanza tra due insiemi
Array.prototype.distance = function(testArr) {
	if (this.compareTo(testArr))// se sono lo stesso insieme
		return 0;
	else
		return 1;

};

Array.prototype.append = function(array) {
	this.push.apply(this, array)
};

Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (this[i] == obj) {
			return true;
		}
	}
	return false;
};

function clone(obj) {
	if (null == obj || "object" != typeof obj)
		return obj;
	var copy = obj.constructor();
	for (var attr in obj) {
		if (obj.hasOwnProperty(attr))
			copy[attr] = obj[attr];
	}
	return copy;
};

Array.prototype.union = function(array, distructive) {

	var out;
	if (distructive)
		out = this;
	else
		out = [];

	for (var i = 0; i < array.length; i++)
		if (!(this.contains(array[i])))
			this.push(array[i]);

};

Array.prototype.intersect = function(array) {

	var out = [];
	for (var i = 0; i < array.length; i++)
		if (this.contains(array[i]))
			out.push(array[i]);

	return out;
};

Array.prototype.difference = function(array) {
	for (var i = 0; i < array.length; i++) {
		if (this.contains(array[i])){
				this.splice(this.indexOf(array[i]), 1);
		}
			
	};
}

Array.prototype.remove = function(id) {
	for (var i in this) {
		if (this[i].id == id)
			this.splice(i, 1);
	}
}

Array.prototype.toString = function() {
	return JSON.stringify(this);
};
