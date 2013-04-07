function Table(divId, destinationDivId, idMap, data) {

	this.divId = divId;
	this.destinationDivId = destinationDivId;
	this.idMap = idMap;
	this.data = data;
	this.selected = [];

	// trasformazione dell' input in lista compatible con datatable'
	var listdata = toList(this.data);

	this.columns = [];
	for (var i = 0; i < listdata[0].length; i++) {
		this.columns.push({
			"sTitle" : listdata[0][i],
		});
	}

	// creazione tabella
	$('#' + this.destinationDivId).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + this.idMap + '"></table>');

	// inizializzazione tabella
	var table = $('#' + this.idMap).dataTable({
		"aaData" : listdata[1],
		"aoColumns" : this.columns,
		"iDisplayLength" : 25,
		"oLanguage" : {
			"sUrl" : baseUrl + "/datatable/dataTables.italian.json"
		}
	});

	// gestione dell'evento click sulle righe della tabella
	// seleziono ogni riga della tabella creata

	/* $('#' + this.idMap + " tbody tr").live('click', function() {
	 var tableCell = $('td', this);
	 }); */

	var selected = this.selected;
	var columns = this.columns;
	var divId = this.divId;
	$('#' + this.idMap + " tbody").delegate("tr", "click", function() {
		var iPos = table.fnGetPosition(this);
		if (iPos != null) {
			// array riga
			var row = table.fnGetData(iPos);
			//get data of the clicked row

			var id;
			for (var i = 0; i < columns.length; i++)
				if (columns[i].sTitle == "id")
					id = row[i];

			var element = data.find(id);
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				selected.remove(element);
			} else {
				$(this).addClass("selected");
				selected.push(element);
			}

			$("#" + divId).trigger("dataChanged");
			//console.log(selected);
			//delete row
			//table.fnDeleteRow(iPos);

		}
	});
}

Table.prototype.getSelected = function() {
	return this.selected;
}
function toList(data) {

	var headers = [];
	var rows = [];

	for (var key in data[0]) {
		if (!isFunction(data[0][key])) {
			headers.push(key);
		}
	}

	for (var i = 0; i < data.length; i++) {
		if (!isFunction(data[i])) {
			rows[i] = new Array();
			for (var key in data[i]) {
				if (!isFunction(data[i][key])) {
					rows[i].push(data[i][key]);
				}
			}
		}
	}

	return [headers, rows];

}
