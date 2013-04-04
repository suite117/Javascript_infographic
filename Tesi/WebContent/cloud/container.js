var containerId = 0;
function createContainer() {

	var id = containerId++;
	var prefix = 'view-container-';
	var divId = prefix + id;
	var nextId = id + 1;

	$("#views-container").append('<div id="' + divId + '" class="view-container" style="position:relative;">' + '<div class="view-header"><div class="droppable">&nbsp;</div><div class="view-buttons"></div></div><div id="view-container-body-' + id + '" class="view-container-body">&nbsp;</div></div>');

	var buttons = $("#" + divId + " .view-buttons");

	var options = [["tutti", "solo selezionati"], ["non noti"]];

	for (var k = 0; k < options.length; k++) {
		buttons.append('<form id="radio-' + k + '"></form>');
		var radioGroup = $("#view-container-" + id + " #radio-" + k);

		for (var i = 0; i < options[k].length; i++) {
			radioGroup.append('<input type="radio" id="' + options[k][i] + '-' + id + '" />');
			radioGroup.append('<label for="' + options[k][i] + '-' + id + '">' + options[k][i] + '</label>');

		}

		radioGroup.buttonset();

	}

	// container listener
	$("#" + divId).data("id", id);

	// evento custom richiamato dal container sorgente
	$("#" + divId).on("dataChange", function(d, param1, param2) {

		//var nextContainer = $(d.currentTarget);

		$("#" + divId + " .view-container-body").text("ciao sono " + id);
		updateNextContainer(id + 1);

		console.log($(this).data());
		console.log(param1);
		console.log(param2);
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

			// this = etichetta del viewer sottostante
			var offset = $(this).offset();
			var x = offset.left;
			var y = offset.top;

			//  test for all clouds
			for (var k = 0; k < draggers.length; k++) {

				// get data of node
				var d = $(draggers[k]).data().d;

				var x1 = d.x;
				var y1 = d.y;

				var dis = distance([x, y], [x1, y1]);

				if (dis < 100) {

					// init container
					$(this).data("d", d);
					draw(d);
					break;
				}
			}
			$(this).removeClass('over').addClass('drop');
			updateNextContainer(nextId);

		}
	});

	function draw(d) {

		var map;
		var destinationDivId = "view-container-body-" + id;
		$("#" + destinationDivId).html("");
		if (d.type == TYPE.SET)
			map = new Table(destinationDivId, "table-" + id, d.elements);
		else if (d.type == TYPE.GEOMAP)
			map = new GeoMap(destinationDivId, "geomap-" + id, d.elements);

	}

	// evento da richiamare per scatenare l'aggiornamento del viewer successivo
	function updateNextContainer(destinationId) {
		$("#" + prefix + destinationId).trigger("dataChange", ['Pass', 'Along', 'Parameters']);
	}

}

