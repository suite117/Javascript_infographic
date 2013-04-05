var containerId = 0;
function createContainer() {

	var id = containerId++;
	var prefix = 'view-container-';
	var divId = prefix + id;
	var nextId = id + 1;
	var data;
	var map;

	$("#views-container").append('<div id="' + divId + '" class="view-container">' + '<div class="view-header"><div class="droppable">&nbsp;</div><div class="view-buttons"><form></form></div></div><div id="view-container-body-' + id + '" class="view-container-body">&nbsp;</div></div>');

	var form = $("#" + divId + " form");

	var options = [["tutti", "ciascuno"], ["non noti"]];

	for (var k = 0; k < options.length; k++) {
		form.append('<div id="radio-' + k + '"></div>');
		var radioGroup = $("#view-container-" + id + " #radio-" + k);

		for (var i = 0; i < options[k].length; i++) {
			radioGroup.append('<input type="radio" id="' + options[k][i] + '-' + id + '" />');
			radioGroup.append('<label for="' + options[k][i] + '-' + id + '">' + options[k][i] + '</label>');

		}

		radioGroup.buttonset();

	}

	// container listener
	$("#" + divId).data("id", id);

	$("#" + divId).on("dataChange", function(d, dataSource, param2) {
		// quando entro qua dentro sono già nel container richiamato dal precedente

		//$("#" + prefix + id + " .view-container-body").text("ciao sono " + id);
		//var data = $("#" + divId).data("d");

		if (data != null) {
			var els = data.elements.joinTable(dataSource.elements, "idEvento", "id");
			console.log(els);
			data.elements = els;
			if (els.length != 0)
				drawMap(id, data);
		}
		// richiamo il container successivo a cascata
		updateNextContainer(id + 1);

		//console.log(param1);
		//console.log(param2);
	});

	// aggiunge l'evento drop all'etichetta del container
	$("#" + divId + " .droppable").droppable({
		tolerance : 'touch',
		over : function() {
			$(this).removeClass('out').addClass('over');
		},
		out : function() {
			$(this).removeClass('over').addClass('out');
		},
		drop : function() {
			//confirm('Permantly delete this item?');
			// this = etichetta droppable del container sottostante
			var offset = $(this).offset();
			var x = offset.left;
			var y = offset.top;

			for (var k = 0; k < draggers.length; k++) {

				// recupero le coordinate dei cloud spostabili
				var d = $(draggers[k]).data().d;

				var x1 = d.x;
				var y1 = d.y;

				var dis = distance([x, y], [x1, y1]);

				if (dis < 100) {
					// conservo l'insieme
					data = d;
					drawMap();

					break;
				}
			}
			$(this).removeClass('over').addClass('drop');
			updateNextContainer(nextId, data);

		}
	});

	function drawMap() {

		var destinationDivId = "view-container-body-" + id;
		$("#" + destinationDivId).html("");
		if (data.type == TYPE.SET)
			map = new Table(destinationDivId, "table-" + id, data.elements);
		else if (data.type == TYPE.GEOMAP)
			map = new GeoMap(destinationDivId, "geomap-" + id, data.elements);
		else if (data.type == TYPE.TREE)
			map = new Tree(destinationDivId, "tree-" + id, data.elements);

		return map;
	}

	function updateNextContainer(destinationId, data) {
		$("#" + prefix + destinationId).trigger("dataChange", [data, 'Along', 'Parameters']);
	}

}

