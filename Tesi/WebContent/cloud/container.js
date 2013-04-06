function createSelect(id, form, options) {
	form.append('<select name="slider" id="flip-' + id + '" data-role="slider"></select>');

	var select = $("#flip-" + id);
	for (var i = 0; i < options.length; i++) {
		select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
	}

	select.slider();
}

function radioButton(id, form, options) {
	form.append('<fieldset id="fieldset-' + id + '" data-role="controlgroup" data-type="horizontal"></fieldset>');

	var fieldset = $("#fieldset-" + id);
	for (var i = 0; i < options.length; i++) {
		var inputId = 'radio-choice-' + i + '-fieldset-' + id;
		fieldset.append('<input type="radio" name="' + inputId + '" id="' + inputId + '" value="' + options[i] + '" />');
		fieldset.append('<label for="' + inputId + '">' + options[i] + '</label>');
		
		$("#" + inputId).on('click', function() {
			$(this).attr("checked", true);
			var label = $("#view-container-" + id + " label");
			if (label.hasClass('ui-btn-active'))
				label.removeClass("ui-btn-active");
			else
				label.addClass('ui-btn-active');

			//fieldset.controlgroup("refresh");
		});
	}

	form.trigger("create");
	//fieldset.controlgroup("refresh");
	$("#" + 'radio-choice-' + 0 + '-fieldset-' + id).attr("checked", true).checkboxradio("refresh");

}

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
	var options = ["tutti", "solo selezionati"];

	//radioButton(id, form, options);
	createSelect(id, form, options);

	// container listener
	$("#" + divId).data("id", id);

	$("#" + divId).on("dataChange", function(d, dataSource, param2) {
		// quando entro qua dentro sono già nel container richiamato dal precedente

		if (data != null) {
			var els = data.elements.joinTable(dataSource.elements, "id", "idEvento");
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

