
var containerId = 0;
function createContainer() {

	var id = containerId++;
	var prefix = 'view-container-';
	var divId = prefix + id;
	var bodyDivId = "view-container-body-" + id;

	var nextId = prefix + parseInt(id + 1);
	var data;
	var map;

	// creazione della barra dei bottoni
	$("#views-container").append('<div id="' + divId + '" class="view-container">' + '<div class="view-header"><div id="' + prefix + 'droppable-' + id + '" class="droppable">&nbsp;</div><div class="view-buttons"><form></form></div></div><div id="view-container-body-' + id + '" class="view-container-body">&nbsp;</div></div>');

	var form = $("#" + divId + " form");

	var fieldset = createFieldset(id, form, ["tutti", "solo selezionati"]);

	// creazione menu del viewer con opzioni
	containerOptions = ["chi", "cosa", "dove", "quando", "gerarchia"];
	var selectMenu = createSelectMenu(id, form, containerOptions);

	// inizializzazioni
	var type = TYPE.TABLE;
	var all = true;
	var active = [];
	var selectedIdList = [];
	var idList = [];
	var idField = getIdField();
	var dataView = [];

	function getIdField() {
		if (data == null)
			return "id";
		else
			return data.views[type].id ? data.views[type].id : data.views[type].columns[0];
	}


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

		if (data.views[type] == null || data.views == null) {
			$("#" + bodyDivId).html("I dati non consentono questa visualizzazione");
			return;
		}
		selectedIdList = [];

		idField = getIdField();

		// scatena l'evento tutti per riaggiornare il viewer e gli altri a cascata
		$("#" + 'radio-choice-' + 0 + '-fieldset-' + id).trigger("click", ["tutti"]);
		//$("#" + divId).trigger('stateChanged', [false, false, true]);
	});

	// container listener
	$("#" + divId).data("id", id);

	// azione relatia al click del mouse su un elemento della mappa
	$("#" + bodyDivId).on("mapClicked", function(t, idValue, isSelected) {

		// recuper il campo id per la selezione attuale'

		if (isSelected) {

			isPresent = false;
			for (var i = 0; i < selectedIdList.length; i++) {
				if (selectedIdList[i] == idValue) {
					isPresent = true;
					break;
				}
			}
			if (!isPresent)
				selectedIdList.push(idValue);

		} else {

			for (var i = 0; i < selectedIdList.length; i++)
				if (selectedIdList[i] == idValue) {
					selectedIdList.splice(i, 1);
					break;
				}
		}

		//console.log("elements", elements);
		//console.log("selectedIdList mapClicked", selectedIdList);

		//console.log(elementsUnique);
		if (!all)
			$("#" + divId).trigger('stateChanged', [false, true, false]);

	});

	$("#" + divId).on("stateChanged", function(t, sourceChanged, mapClicked, viewChanged) {

		//console.log("input to stateChanged " + divId, data.elements);

		// recupero il campo id della proiezione attuale
		var idField = getIdField();
		// rimuove i duplicati
		var elementsUnique = dataView.elements.removeDuplicates(idField);

		idList = [];
		for (var ii = 0; ii < elementsUnique.length; ii++) {
			idList.push(elementsUnique[ii][idField]);
		}

		if (!all) {
			selected_new = [];
			for (var i = 0; i < selectedIdList.length; i++) {
				isPresent = false;
				for (var j = 0; j < idList.length; j++)
					if (selectedIdList[i] == idList[j]) {
						isPresent = true;
						break;
					}
				if (isPresent)
					selected_new.push(selectedIdList[i]);
			}

			selectedIdList = selected_new;
		}

		// proiezione dei campi rispetto alle colonne specificate nella view selezionata
		// recupero le colonne della proiezione
		var columns = data.views[type].columns;
		elementsUnique = elementsUnique.project(columns);

		// creazione nuovo oggetto per avere i campi per il viewer selezionato
		var d = {};
		d.id = id;
		d.name = type + "-" + id;
		d.elements = elementsUnique;
		d.views = {};
		d.views[type] = data.views[type];

		if (id != 0)
			createDraggableCloud("view-container-droppable-" + id, d);

		//console.log("elementsUnique", elementsUnique);

		if (map == null || viewChanged)
			initMap(elementsUnique);
		else if (!mapClicked)
			updateMap(elementsUnique, selectedIdList);

		if (viewChanged || sourceChanged || mapClicked)
			updateNextContainer(map, data, selectedIdList, nextId, sourceChanged, mapClicked);

	});

	function updateNextContainer(map, data, selectedIds, nextId, sourceChanged, mapClicked) {
		if (sourceChanged || mapClicked) {

			var idField = getIdField();
			$("#" + nextId).trigger("sourceChanged", [data, idField, !all ? selectedIdList : idList]);
		}
	}


	$("#" + divId).on("sourceChanged", function(t, dataSource, idFieldSource, selectedSource) {

		// inizializzazione data del container (base di dati)
		if (dataSource != null) {
			data = dataSource;
			dataView = clone(data);
		}

		// inizializzazione base di dati per la view attuale
		dataView.elements = [];
		for (var i = 0; i < data.elements.length; i++) {
			var element = data.elements[i];
			for (var j = 0; j < selectedSource.length; j++) {
				if (element[idFieldSource] == selectedSource[j]) {
					dataView.elements.push(element);
					break;
				}
			}
		}

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
		// evento nuvola sull'etichetta del container
		drop : function() {

			if (id != 0)
				return;

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
					// conservo l'insieme della nuvola
					data = d;
					dataView = clone(data);
					selectedIdList = [];
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

				map = new Table(bodyDivId, "table-" + id, elementsUnique, {
					id : idField,

				});
				break;
			case TYPE.GEOMAP:
				map = new GeoMap(bodyDivId, "geomap-" + id, elementsUnique, {
					id : idField,
					name : "nomeEvento",
				});
				break;
			case TYPE.TREE:
				map = new Tree(bodyDivId, "tree-" + id, elementsUnique);
				break;
		}

	}

	function updateMap(elementsUnique, selectedIdList) {

		if (elementsUnique == null)
			alert("elementsUnique è null");

		switch(type) {
			case TYPE.TABLE:

				break;
		}

		map.draw(elementsUnique, selectedIdList);

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

				// per forzare l'aggiornamento quando si cambia la vista'
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

				$("#" + divId).trigger('stateChanged', [ forceVal ? true : false, oldVal != val ? true : false, forceVal ? true : false]);
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

	function createSelectSlider(id, form, options) {
		form.append('<select name="slider" id="flip-' + id + '" data-role="slider"></select>');

		var select = $("#flip-" + id);
		for (var i = 0; i < options.length; i++) {
			select.append('<option value="' + options[i] + '">' + options[i] + '</option>');
		}

		select.slider();

		return selext;
	}

}

