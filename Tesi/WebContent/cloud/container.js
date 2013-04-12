function createSelectSlider(id, form, options) {
	form.append('<select name="slider" id="flip-' + id + '" data-role="slider"></select>');

	var select = $("#flip-" + id);
	for (var i = 0; i < options.length; i++) {
		select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
	}

	select.slider();
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

	var fieldset = createFieldset(id, form, ["tutti", "solo selezionati"]);

	containerOptions = ["chi", "cosa", "dove", "quando", "gerarchia"];

	var select = createSelectMenu(id, form, containerOptions);

	var type = TYPE.TABLE;
	var all = true;
	var active = [];

	select.on('change', function(e) {

		var selectedOption = $(this).val();

		switch(selectedOption) {
			case "chi":
			case "cosa":
				type = TYPE.TABLE;
				break;
			case "dove":
				type = TYPE.GEOMAP;
				break;
			case "quando":
				type = TYPE.TIMELINE;
				break;
			case "gerarchia":
				type = TYPE.TREE;
				break;
		}

		//initMap(data);

		$("#" + divId).trigger('stateChanged', [false, false, true]);
	});

	// container listener
	$("#" + divId).data("id", id);

	$("#" + divId).on("mapClicked", function(t, idValue, isSelected) {
		//var elementsUnique = data.elements.removeDuplicates(data.views[type][0]);

		// recuper il campo id per la selezione attuale'
		var idField = data.views[type][0];
		var elements;
		var mapSelected = map.getSelected();
		if (isSelected) {

			for (var i = 0; i < mapSelected.length; i++) {
				elements = data.elements.findAll(idField, mapSelected[i].id);
				active.addAll(elements);
			}
		} else {
			elements = data.elements.findAll(idField, idValue);
			active = active.removeAll(elements);
		}

		//console.log("elements", elements);
		//console.log("active", active);

		//console.log(elementsUnique);
		if (!all)
			$("#" + divId).trigger('stateChanged', [false, true, false]);

	});

	$("#" + divId).on("stateChanged", function(t, sourceChanged, mapClicked, viewChanged) {

		//console.log('sourceChanged ' + sourceChanged);
		console.log("input to stateChanged " + divId, data.elements);

		if (map == null || viewChanged)
			initMap(data);
		else if (!mapClicked)
			updateMap(data);

		if (viewChanged || sourceChanged || mapClicked)
			updateNextContainer(data, active, nextId, sourceChanged, mapClicked);

	});

	function updateNextContainer(data, active, nextId, sourceChanged, mapClicked) {
		if (sourceChanged || mapClicked) {

			var elements;
			if (all)
				elements = data.elements;
			else {
				elements = active;
				console.log("active", active);
			}

			console.log("out to " + nextId, elements);
			var out = clone(data);
			out.elements = elements;

			$("#" + nextId).trigger("sourceChanged", [out]);
		}
	}


	$("#" + divId).on("sourceChanged", function(t, dataSource, param2) {

		data = dataSource;
		active = active.intersect(data.elements);

		// aggiorno il contenuto richiamo il container successivo a cascata
		$("#" + divId).trigger('stateChanged', [true, false, false]);

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

				if (dis < 80) {
					// conservo l'insieme
					data = d;

					$("#" + divId).trigger('stateChanged', [true, false, false]);
					break;
				}
			}
			$(this).removeClass('over').addClass('drop');

		}
	});

	function initMap(data) {

		// le colonne della proiezione
		var columns = data.views[type];

		if (data == null)
			alert("data è null");

		// rimuove i duplicati
		var elementsUnique = data.elements.removeDuplicates(columns[0]);

		$("#" + bodyDivId).html("");
		switch(type) {
			case TYPE.TABLE:
				elementsUnique = elementsUnique.project(columns);

				map = new Table(divId, bodyDivId, "table-" + id, elementsUnique, {
					include : data.views[TYPE.TABLE]
				});
				break;
			case TYPE.GEOMAP:
				map = new GeoMap(divId, bodyDivId, "geomap-" + id, elementsUnique);
				break;
			case TYPE.TREE:
				map = new Tree(divId, bodyDivId, "tree-" + id, elementsUnique);
				break;
		}

		//console.log(elementsUnique);
	}

	function updateMap(data) {

		if (data == null)
			alert("data è null");

		var columns = data.views[type];

		// rimuove i duplicati
		var elementsUnique = data.elements.removeDuplicates(columns[0]);

		switch(type) {
			case TYPE.TABLE:
				elementsUnique = data.elements.project(columns);
				break;
		}

		map.draw(elementsUnique);

	}

	var oldVal;
	var val;
	function createFieldset(id, form, options) {
		form.append('<fieldset id="fieldset-' + id + '" data-role="controlgroup" data-type="horizontal"></fieldset>');

		var fieldset = $("#fieldset-" + id);
		var sourceChanged;

		for (var i = 0; i < options.length; i++) {
			var inputId = 'radio-choice-' + i + '-fieldset-' + id;
			fieldset.append('<input type="radio" name="' + inputId + '" id="' + inputId + '" value="' + options[i] + '" />');
			fieldset.append('<label for="' + inputId + '">' + options[i] + '</label>');

			$("#" + inputId).on('click', function(e) {
				oldVal = val;
				val = $(this).val();

				if (val == 'tutti') {
					all = true;
				} else {

					all = false;
				}

				var label = $("#view-container-" + id + " label");
				if (label.hasClass('ui-btn-active'))
					label.removeClass("ui-btn-active");
				else {
					label.addClass('ui-btn-active');
					$(this).attr("checked", true);
				}
				//fieldset.controlgroup("refresh");
				if (oldVal != val)
					$("#" + divId).trigger('stateChanged', [false, true, false]);
			});
		}

		form.trigger("create");
		//fieldset.controlgroup("refresh");
		$("#" + 'radio-choice-' + 0 + '-fieldset-' + id).attr("checked", true).checkboxradio("refresh");

		return fieldset;

	}

	function createSelectMenu(id, form, options) {
		form.append('<select name="menu" id="select-menu-' + id + '" data-mini="true"></select>');

		var select = $("#select-menu-" + id);
		for (var i = 0; i < options.length; i++) {
			select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
		}

		select.selectmenu();

		return select;
	}

}

