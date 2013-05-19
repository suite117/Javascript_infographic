function Table(destinationDivId, idField, data, optional) {

	this.destinationDivId = destinationDivId;
	this.idMap = destinationDivId + '-table';

	this.selected = [];

	//var idField = "id";
	var imageField = "image";
	if (optional != null) {
		//idField = optional.id ? optional.id : idField;
		imageField = optional.image ? optional.image : imageField;
	}

	var fields = data.getFields();
	this.columns = [];
	for (var i = 0; i < fields.length; i++) {

		this.columns.push({
			"sTitle" : fields[i],
		});
		if (fields[i] == idField)
			this.indexIdColumn = i;
		else if (fields[i] == imageField)
			this.indexImageColumn = i;

	}

	this.draw(data);
}

Table.prototype.draw = function(data, selected) {

	this.data = data;
	//console.log("data", data);
	this.selected = selected ? selected : this.selected;

	// creazione tabella
	$('#' + this.destinationDivId).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + this.idMap + '"></table>');

	// inizializzazione tabella
	var selected = this.selected;
	var destinationDivId = this.destinationDivId;

	// trasformazione dell' input in lista compatible con datatable'
	var listdata = toList(this.data);

	this.rows = listdata[1];

	var indexIdColumn = this.indexIdColumn;
	var indexImageColumn = this.indexImageColumn;

	this.table = $('#' + this.idMap).dataTable({
		"aaData" : this.rows,
		"aoColumns" : this.columns,
		"iDisplayLength" : 25,
		"oLanguage" : {
			"sUrl" : baseUrl + "/table/dataTables.italian.json"
		},
		"fnRowCallback" : function(nRow, aData, iDisplayIndex, iDisplayIndexFull) {
			var id = aData[indexIdColumn];

			// aggiunge l'id alla riga
			$(nRow).attr("id", destinationDivId + "-tr-" + id);

			// aggiunge la classe selected se è tra i selezionati
			for (var i = 0; i < selected.length; i++) {
				if (id == selected[i]) {
					$(nRow).addClass("selected");
					break;
				}
			}

			// processa se presente il path di un'immagine
			$('td:eq(' + indexImageColumn + ')', nRow).html('<img src="' + aData[indexImageColumn] + '" style="width:100px; margin:0; padding: 0;"></img>');

			return nRow;
		}
	});

	// gestione dell'evento click sulle righe della tabella
	// seleziono ogni riga della tabella creata

	/* $('#' + this.idMap + " tbody tr").live('click', function() {
	var tableCell = $('td', this);
	}); */

	// memorizza l'indice della colonna

	var table = this.table;
	$('#' + this.idMap + " tbody").delegate("tr", "click", function() {
		var iPos = table.fnGetPosition(this);
		var isSelected = false;
		if (iPos != null) {
			// array riga
			var row = table.fnGetData(iPos);
			//get data of the clicked row
			var id = row[indexIdColumn];
			var element = data.find(id);
			if ($(this).hasClass("selected")) {
				$(this).removeClass("selected");
				//selected.remove(element);
				//console.log(selected);
			} else {
				$(this).addClass("selected");
				//selected.push(element);
				isSelected = true;
				//console.log(selected);

			}

			$("#" + destinationDivId).trigger("mapClicked", [id, isSelected]);
			//console.log(selected);

		}
	});

}
//delete row
Table.prototype.deleteRow = function(index) {
	this.table.fnDeleteRow(index);
};

Table.prototype.getSelected = function() {
	var selected = [];

	var rows = this.table.fnGetNodes();

	for (var i = 0; i < rows.length; i++) {

		//console.log($(rows[i]).attr("class"));
		if ($(rows[i]).hasClass("selected")) {
			var id = $(rows[i]).find('td:eq(' + this.indexIdColumn + ')').html();
			selected.push(parseInt(id));
		}
	}

	return selected;
};

function toList(data) {

	var headers = data.getFields();

	var rows = [];
	for (var i = 0; i < data.length; i++) {
		if (!isFunction(data[i])) {
			rows[i] = new Array();
			for (var key in data[i]) {
				if (!isFunction(data[i][key])) {
					rows[i].push(data[i][key] ? data[i][key] : "");
				}
			}
		}
	}
	
	console.log(headers);

	return [headers, rows];

}
