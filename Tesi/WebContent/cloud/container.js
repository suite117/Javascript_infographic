function createSelectSlider(id, form, options) {
	form.append('<select name="slider" id="flip-' + id + '" data-role="slider"></select>');

	var select = $("#flip-" + id);
	for (var i = 0; i < options.length; i++) {
		select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
	}

	select.slider();
}

function createSelectMenu(id, form, options) {
	form.append('<select name="menu" id="select-menu-' + id + '" data-mini="true"></select>');

	var select = $("#select-menu-" + id);
	for (var i = 0; i < options.length; i++) {
		select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
	}

	select.selectmenu();
}

var containerId = 0;
function createContainer() {

	var id = containerId++;
	var prefix = 'view-container-';
	var divId = prefix + id;
	var bodyDivId = "view-container-body-" + id;
	
	var nextId = prefix + parseInt(id + 1);
	var data;
	var map;

	$("#views-container").append('<div id="' + divId + '" class="view-container">' + '<div class="view-header"><div class="droppable">&nbsp;</div><div class="view-buttons"><form></form></div></div><div id="view-container-body-' + id + '" class="view-container-body">&nbsp;</div></div>');

	var form = $("#" + divId + " form");

	createFieldset(id, form, ["tutti", "solo selezionati"]);
	createSelectMenu(id, form, ["tutti", "solo selezionati"]);

	// container listener
	$("#" + divId).data("id", id);

	$("#" + divId).on("dataChanged", function(t) {
		var selected = map.getSelected();
		
		if (data.all == true || selected == null)
			data.elements = data._elements;
		else
			data.elements = selected;

		//console.log(data.elements);
		updateNextContainer(nextId, data);
	});

	$("#" + divId).on("sourceChanged", function(t, dataSource, param2) {
		// quando entro qua dentro sono già nel container richiamato dal precedente
		//console.log("data" + data.elements.print());

		if (data != null && dataSource != null) {
			data.elements = data._elements;
			var els = data.elements.filter(dataSource.elements, "idEvento", "id");
			//console.log("id " + id);
			//console.log("dataSource " + dataSource.elements.print());
			//console.log("data.elements " + data.elements.print());
			//console.log("els " + els.print());

			if (els.length != 0) {
				data.elements = els;
			}

			map.draw(data.elements);
			//initMap(data);
			// richiamo il container successivo a cascata
		}

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
					data.all = true;
					data._elements = data.elements;
					initMap(data);

					break;
				}
			}
			$(this).removeClass('over').addClass('drop');
			updateNextContainer(nextId, data);

		}
	});

	function initMap(data) {

		
		$("#" + bodyDivId).html("");

		if (data.type == TYPE.SET)
			map = new Table(divId, bodyDivId, "table-" + id, data.elements);
		else if (data.type == TYPE.GEOMAP)
			map = new GeoMap(divId, bodyDivId, "geomap-" + id, data.elements);
		else if (data.type == TYPE.TREE)
			map = new Tree(divId, bodyDivId, "tree-" + id, data.elements);

		return map;
	}

	function updateNextContainer(divId, elements) {
		if (elements != null)
			$("#" + divId).trigger("sourceChanged", [elements]);
	}

	function createFieldset(id, form, options) {
		form.append('<fieldset id="fieldset-' + id + '" data-role="controlgroup" data-type="horizontal"></fieldset>');

		var fieldset = $("#fieldset-" + id);
		for (var i = 0; i < options.length; i++) {
			var inputId = 'radio-choice-' + i + '-fieldset-' + id;
			fieldset.append('<input type="radio" name="' + inputId + '" id="' + inputId + '" value="' + options[i] + '" />');
			fieldset.append('<label for="' + inputId + '">' + options[i] + '</label>');

			$("#" + inputId).on('click', function(e) {

				val = $(this).val();

				if (val == 'tutti')
					data.all = true;
				else
					data.all = false;

				var label = $("#view-container-" + id + " label");
				if (label.hasClass('ui-btn-active'))
					label.removeClass("ui-btn-active");
				else {
					label.addClass('ui-btn-active');
					$(this).attr("checked", true);
				}
				//fieldset.controlgroup("refresh");

				$("#" + divId).trigger('dataChanged');
			});
		}

		form.trigger("create");
		//fieldset.controlgroup("refresh");
		$("#" + 'radio-choice-' + 0 + '-fieldset-' + id).attr("checked", true).checkboxradio("refresh");

	}

}

