function isFunction(functionToCheck) {
	var getType = {};
	return functionToCheck
			&& getType.toString.call(functionToCheck) === '[object Function]';
}

function createObjfromObj(input, mapping) {

	var out = new Object();

	// per ogni elemento del mapping crea un oggetto con chiave specificata a
	// sinistra del mapping e valore
	// l'elaborazione della parte destra del mapping
	for (key in mapping) {
		var f = mapping[key][0];
		if (isFunction(f)) {

			var arguments = mapping[key].slice(1);

			if (arguments.length == 1) {
				if (arguments[0] instanceof Array) {
					var args = new Array();
					for (var i = 0; i < arguments[0].length; i++) {
						args[i] = input[arguments[0][i]];
						//document.writeln(args[i] + "<br />");
					}
					
					out[key] = f.call(null, args);
				} else
					// viene passato il singolo parametro
					out[key] = f.call(null, new Array(input[arguments]));
			} else {
				// recupera i valori delle proprietà dell'oggetto
				// e li passa alla funzione
				var args = new Array();
				for (var i = 0; i < arguments.length; i++) {
					args[i] = input[arguments[i]];
					//document.write("p: " + args[i]);
				}
				out[key] = f.call(null, args);

			}
		} else
			out[key] = input[mapping[key]];
	}

	return out;
}
