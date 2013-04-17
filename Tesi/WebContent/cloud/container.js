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

	var selectMenu = createSelectMenu(id, form, containerOptions);

	var type = TYPE.TABLE;
	var all = true;
	var active = [];
	var selected = [];
	var selectedAll = [];
	var idField = "id";
	var dataView = [];

	selectMenu.on('change', function(e) {

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
		//active = [];
		selected = [];

		idField = data.views[type][0];
		$("#" + 'radio-choice-' + 0 + '-fieldset-' + id).trigger("click", ["tutti"]);
		//$("#" + divId).trigger('stateChanged', [false, false, true]);
	});

	// container listener
	$("#" + divId).data("id", id);

	// azione relatia al click del mouse su un elemento della mappa
	$("#" + divId).on("mapClicked", function(t, idValue, isSelected) {

		// recuper il campo id per la selezione attuale'

		//var mapSelected = map.getSelected();
		//var elements = data.elements.findAll(idField, idValue);
		if (isSelected) {
			//active = [];
			//for (var i = 0; i < mapSelected.length; i++) {

			//active.pushAll(elements);

			isPresent = false;
			for (var i = 0; i < selected.length; i++) {
				if (selected[i] == idValue) {
					isPresent = true;
					break;
				}
			}
			if (!isPresent)
				selected.push(idValue);
			//}
		} else {
			//elements = data.elements.findAll(idField, idValue);
			//active = active.removeAll(elements);

			for (var i = 0; i < selected.length; i++)
				if (selected[i] == idValue) {
					selected.splice(i, 1);
					break;
				}
		}

		//console.log("elements", elements);
		//console.log("selected mapClicked", selected);

		//console.log(elementsUnique);
		if (!all)
			$("#" + divId).trigger('stateChanged', [false, true, false]);

	});

	$("#" + divId).on("stateChanged", function(t, sourceChanged, mapClicked, viewChanged) {

		//console.log("input to stateChanged " + divId, data.elements);

		// le colonne della proiezione
		var columns = data.views[type];

		// rimuove i duplicati
		var elementsUnique = dataView.elements.removeDuplicates(columns);
		//console.log("elementsUnique", elementsUnique);

		selectedAll = [];
		for (var ii = 0; ii < elementsUnique.length; ii++) {
			selectedAll.push(elementsUnique[ii][columns[0]]);
		}

		//selected = map.getSelected();
		//console.log("selected", selected);
		selected_new = [];
		//if (!all) {
			for (var i = 0; i < selected.length; i++) {
				isPresent = false;
				for (var j = 0; j < selectedAll.length; j++)
					if (selected[i] == selectedAll[j]) {
						isPresent = true;
						break;
					}
				if (isPresent)
					selected_new.push(selected[i]);
			}
			
			selected = selected_new;
		//}

		if (map == null || viewChanged)
			initMap(elementsUnique);
		else if (!mapClicked)
			updateMap(elementsUnique, selected);

		if (viewChanged || sourceChanged || mapClicked)
			updateNextContainer(map, data, selected, nextId, sourceChanged, mapClicked);

	});

	function updateNextContainer(map, data, selectedIds, nextId, sourceChanged, mapClicked) {
		if (sourceChanged || mapClicked) {

			//console.log("out to " + nextId, elements);
			//var out = clone(data);
			//out.elements = active; */

			$("#" + nextId).trigger("sourceChanged", [data, data.views[type][0], !all ? selected : selectedAll]);
		}
	}


	$("#" + divId).on("sourceChanged", function(t, dataSource, idFieldSource, selectedSource) {

		// inizializzazione data del container (base di dati)
		if (data == null) {
			data = dataSource;
			dataView = clone(data);
		}

		//selected = [];
		//	console.log("CONTAINER " + id);

		//	console.log("selectedSource", selectedSource);
		dataView.elements = [];

		for (var i = 0; i < data.elements.length; i++) {
			var element = data.elements[i];
			for (var j = 0; j < selectedSource.length; j++) {
				if (element[idFieldSource] == selectedSource[j]) {
					dataView.elements.push(element);
					break;
				}

			}

			/*
			 isPresent = false;
			 for (var k = 0; k < selectedAll.length; k++) {
			 if (element[idField] == selectedAll[k]) {
			 isPresent = true;
			 break;
			 }
			 }
			 if (!isPresent)
			 selectedAll.push(element[idField]);
			 */
		}

		//active = active.intersect(activeSource);

		//	console.log("data.elements", data.elements);
		//console.log("dataView.elements", dataView.elements);

		// ricerca righe con
		//

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

			if (id != 0)
				return;
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
					dataView = clone(data);

					$("#" + divId).trigger('stateChanged', [true, false, false]);
					break;
				}
			}
			$(this).removeClass('over').addClass('drop');

		}
	});

	function initMap(elementsUnique) {

		if (elementsUnique == null)
			alert("elementsUnique è null");

		$("#" + bodyDivId).html("");
		switch(type) {
			case TYPE.TABLE:
				elementsUnique = elementsUnique.project(dataView.views[type]);

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

	}

	function updateMap(elementsUnique, selected) {

		if (elementsUnique == null)
			alert("elementsUnique è null");

		switch(type) {
			case TYPE.TABLE:
				elementsUnique = elementsUnique.project(dataView.views[type]);
				break;
		}

		map.draw(elementsUnique, selected);

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

			$("#" + inputId).on('click', function(e, forceVal) {
				oldVal = val;
				val = forceVal ? forceVal : $(this).val();

				if (val == 'tutti') {
					all = true;
				} else
					all = false;

				var label = $("#view-container-" + id + " label");
				if (label.hasClass('ui-btn-active'))
					label.removeClass("ui-btn-active");
				else {
					label.addClass('ui-btn-active');
					$(this).attr("checked", true);
				}
				//fieldset.controlgroup("refresh");

				$("#" + divId).trigger('stateChanged', [forceVal ? true : false, oldVal != val ? true : false, forceVal ? true : false]);
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

