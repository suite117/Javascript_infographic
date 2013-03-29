Object.equals = function(x, y) {
	if (x === y)
		return true;
	// if both x and y are null or undefined and exactly the same

	if (!( x instanceof Object ) || !( y instanceof Object ))
		return false;
	// if they are not strictly equal, they both need to be Objects

	if (x.constructor !== y.constructor)
		return false;
	// they must have the exact same prototype chain, the closest we can do is
	// test there constructor.

	for (var p in x ) {
		if (! x.hasOwnProperty(p))
			continue;
		// other properties were tested using x.constructor === y.constructor

		if (! y.hasOwnProperty(p))
			return false;
		// allows to compare x[ p ] and y[ p ] when set to undefined

		if (x[p] === y[p])
			continue;
		// if they have the same strict value or identity then they are equal

		if ( typeof (x[p] ) !== "object")
			return false;
		// Numbers, Strings, Functions, Booleans must be strictly equal

		if (! Object.equals(x[p], y[p]))
			return false;
		// Objects and Arrays must be tested recursively
	}

	for (p in y ) {
		if (y.hasOwnProperty(p) && ! x.hasOwnProperty(p))
			return false;
		// allows x[ p ] to be set to undefined
	}
	return true;
}
// Estensione della classe array
Array.prototype.toList = function() {

	var headers = new Array();
	var rows = new Array();

	for (var key in this[0]) {
		if (!isFunction(this[0][key])) {
			headers.push(key);
		}
	}

	for (var i = 0; i < this.length; i++) {
		if (!isFunction(this[i])) {
			rows[i] = new Array();
			for (var key in this[i]) {
				if (!isFunction(this[i][key])) {
					rows[i].push(this[i][key]);
				}
			}
		}
	}

	return [headers, rows];

}

Array.prototype.printTable = function(idTable) {
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

	outText += '<table id="' + idTable + '"><thead><tr>' + tHead.join("") + '</tr></thead><tbody>';

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

// verifica se due array sono uguali
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

/*concatena due array
 Array.prototype.append = function(array) {
 this.push.apply(this, array)
 };*/

function equals(x, y) {
	return x.id != null && y.id != null && x.id == y.id;

};

//Metodo che permette di verificare se un oggetto è contenuto in un array
Array.prototype.contains = function(obj) {
	var i = this.length;
	while (i--) {
		if (equals(this[i], obj)) {
			return true;
		}
	}
	return false;
};

Array.prototype.find = function(id) {
	var i = this.length;
	while (i--) {
		if (this[i].id == id) {
			return this[i];
		}
	}
	return null;
};

//Permette di clonare gli oggetti
function clone(obj) {
	// Handle the 3 simple types, and null or undefined
	if (null == obj || "object" != typeof obj)
		return obj;

	// Handle Date
	if ( obj instanceof Date) {
		var copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}

	// Handle Array
	if ( obj instanceof Array) {
		var copy = [];
		for (var i = 0, len = obj.length; i < len; i++) {
			copy[i] = clone(obj[i]);
		}
		return copy;
	}

	// Handle Object
	if ( obj instanceof Object) {
		var copy = {};
		for (var attr in obj) {
			if (obj.hasOwnProperty(attr))
				copy[attr] = clone(obj[attr]);
		}
		return copy;
	}

	throw new Error("Unable to copy obj! Its type isn't supported.");
};
//Unione tra due array
Array.prototype.union = function(array) {

	var out = clone(this);
	for (var i = 0; i < array.length; i++)
		if (!(this.contains(array[i])))
			out.push(array[i]);

	return out;
};

//metodo che implementa l' intersezione tra due insiemi(array) di elementi
Array.prototype.intersect = function(array) {

	var out = [];
	for (var i = 0; i < array.length; i++)
		if (this.contains(array[i]))
			out.push(array[i]);

	return out;
};

//metodo che implementa la differenza tra insiemi
Array.prototype.difference = function(array) {
	for (var i = 0; i < array.length; i++) {
		if (this.contains(array[i])) {
			this.splice(this.indexOf(array[i]), 1);
		}

	};
};

Array.prototype.add = function(object) {
	if (!this.contains(object))
		this.push(object);

};
//Rimuove un oggetto da un array di oggetti che hanno il campo id
Array.prototype.remove = function(id) {
	for (var i in this) {
		if (this[i].id == id)
			this.splice(i, 1);
	}
}

Array.prototype.toString = function() {
	return JSON.stringify(this);
};
