// Stampa l'oggetto per funzioni di debug
Array.prototype.print = function() {
	return JSON.stringify(this);
};

// Mapping di un oggetto ad un altro oggetto con applicazione di eventuali
// funzioni
Array.prototype.map1 = function(mapping) {

	var out = [];
	for (i in this) {
		if (!isFunction(this[i]))
			out[i] = createObjfromObj(this[i], mapping);
	}

	return out;
};

Array.prototype.containsId = function(idValue) {

	var i = this.length;
	while (i--) {
		if (this[i]["id"] == idValue) {
			return true;
		}
	}
	return false;
};

// rimuove gli elementi duplicati
Array.prototype.removeDuplicates = function(columns) {

	var idField = columns[0];
	var elements = [];
	for (var i = 0; i < this.length; i++) {
		if (!elements.containsId(this[i][idField])) {
			var element = clone(this[i]);
			element["id"] = this[i][idField];
			//for (var j = 1; j < columns.length; j++) {
			//	element[columns[j]] = this[i][columns[j]];
			//}
			elements.push(element);
			
		}
	}

	return elements;
};

Array.prototype.joinTable = function(arr, idTab1, idTab2) {

	var out = [];
	var k = 0;
	for (var i in this) {
		if (!isFunction(this[i])) {
			for (var j in arr) {
				if (!isFunction(arr[j]) && this[i][idTab1] == arr[j][idTab2]) {
					// assegno i campi della prima tabella
					out[k] = clone(this[i]);
					// assegno i campi della seconda tabella
					for (var key in arr[j]) {
						// primo test per evitare di sovrascrivere l'id originario
						// secondo test per non riportare la colonna di join della seconda tabella
						if (key != idTab1)
							out[k][key] = arr[j][key];
					}
					k++;
				}

			}
		}
		//out["id"] = k;
	}

	return out;
};

Array.prototype.filter = function(arr, idTab1, idTab2) {

	var out = [];
	var k = 0;
	for (var i in this) {
		if (!isFunction(this[i])) {
			for (var j in arr) {
				if (!isFunction(arr[j]) && this[i][idTab1] == arr[j][idTab2]) {
					// assegno i campi della prima tabella
					out[k] = this[i];
					k++;
				}

			}
		}

	}

	return out;
};

// Estensione della classe array

// Distanza tra due insiemi
Array.prototype.distance = function(testArr) {
	if (this.compareTo(testArr))// se sono lo stesso insieme
		return 0;
	else
		return 1;

};

// concatena due array
Array.prototype.append = function(array) {
	this.push.apply(this, array)
};

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

Array.prototype.find = function(idValue) {
	var i = this.length;
	while (i--) {
		if (this[i].id == idValue) {
			return this[i];
		}
	}
	return null;
};

Array.prototype.findAll = function(fieldName, fieldValue) {
	var i = this.length;
	var out = [];
	//console.log("fieldName", fieldName, fieldValue);
	while (i--) {

		//console.log("found", this[i][fieldName]);
		if (this[i][fieldName] == fieldValue) {
			out.add(this[i]);

		}
	}

	return out;
};

Array.prototype.removeAll = function(elements) {

	var out = [];

	for (var i = 0; i < this.length; i++) {
		var exclude = false;
		for (var j = 0; j < elements.length; j++) {
			if (elements[j].id == this[i].id) {
				exclude = true;
				break;
			}
		}
		if (!exclude)
			out.push(this[i]);
	}

	return out;
}
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
}

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

Array.prototype.addAll = function(elements) {

	for (var i = 0; i < elements.length; i++)
		this.add(elements[i]);

}
//Rimuove un oggetto da un array di oggetti che hanno il campo id
Array.prototype.remove = function(object) {
	for (var i in this) {
		if (this[i].id == object.id)
			this.splice(i, 1);
	}
};


Array.prototype.removeById = function(idValue) {
	for (var i in this) {
		if (this[i].id == idValue)
			this.splice(i, 1);
	}
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

// ritorna le etichettte dei campi
Array.prototype.getFields = function() {
	var headers = [];

	for (var key in this[0]) {
		if (!isFunction(this[0][key])) {

			headers.push(key);
		}
	}

	return headers;
};

Array.prototype.project = function(columns) {
	var elementsProjected = [];
	var k = 0;
	for (var i = 0; i < this.length; i++) {
		elementsProjected[k] = {};
		for (var index in columns) {
			var key = columns[index];
			if (!isFunction(key)) {
				elementsProjected[k][key] = this[i][key];
			}
		}
		k++;
	}

	return elementsProjected;
};
