function Table(destinationDivId, idMap, set) {

	this.destinationDivId = destinationDivId;
	this.idMap = idMap;
	this.set = set;

	var listSet = toList(this.set);

	var aoColumns = new Array();
	for (var i = 0; i < listSet[0].length; i++) {
		aoColumns.push({
			"sTitle" : listSet[0][i],
			 
		});
	}

	$('#' + this.destinationDivId).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + this.idMap + '"></table>');
	$('#' + this.idMap).dataTable({
		"aaData" : listSet[1],
		"aoColumns" : aoColumns,
		"iDisplayLength": 25,
		"oLanguage" : {
			"sUrl" : baseUrl + "/datatable/dataTables.italian.json"
		}
	});

}

function toList(set) {

	var headers = new Array();
	var rows = new Array();

	for (var key in set[0]) {
		if (!isFunction(set[0][key])) {
			headers.push(key);
		}
	}

	for (var i = 0; i < set.length; i++) {
		if (!isFunction(set[i])) {
			rows[i] = new Array();
			for (var key in set[i]) {
				if (!isFunction(set[i][key])) {
					rows[i].push(set[i][key]);
				}
			}
		}
	}

	return [headers, rows];

}
