function Graph(nodes) {
	this.nodes = nodes;
};

// Graph.prototype = new Array();

Graph.prototype.print = function() {
	var outText = "";
	for (i in this.nodes)
		for (key in this.nodes[i])
			if (!isFunction(this.nodes[i][key]))
				outText += "<br />" + key + " " + this.nodes[i][key];

	document.writeln(outText);
	return;
};

Graph.prototype.map = function(mapping) {

	var outnodes = new Graph(new Array());
	for (i in this.nodes) {
		outnodes.nodes[i] = createObjfromObj(this.nodes[i], mapping);
	}

	return outnodes;
};
