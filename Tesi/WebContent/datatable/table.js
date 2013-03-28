

function Table(destinationDiv, idDiv, set) {
	var listSet = set.toList();

	var aoColumns = new Array();
	for (var i = 0; i < listSet[0].length; i++) {
		aoColumns.push({
			"sTitle" : listSet[0][i]
		});
	}

	$(destinationDiv).html('<table cellpadding="0" cellspacing="0" border="0" class="display" id="' + idDiv + '"></table>');
	$('#' + idDiv).dataTable({
		"aaData" : listSet[1],
		"aoColumns" : aoColumns
	});

}
