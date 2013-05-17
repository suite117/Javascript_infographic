// creazione del contenitore dei viewer
// 'maxContainerIds' variabile globale che tiene conto dell'id (intero attuale massimo)
maxContainerIds = 0;
function createContainer(destinationDivId, containerOptions) {
	for (var i = 0; i < 3; i++) {
		Viewer(destinationDivId, containerOptions, i, i - 1, i + 1);
		maxContainerIds++;
	}
	
}

function Viewer(destinationDivId, containerOptions, id, prevId, nextId) {

	// prefisso globale del viewer
	var prefix = destinationDivId + '_viewer_';
	// id del div principale del viewer
	var divId = prefix + id;
	var bodyDivId = prefix + "viewer_body_" + id;
	// id DOM del form contenente i pulsanti
	var formId = divId + '_form';

	// id DOM del container precedente e successivo
	var prevDivId = prefix + prevId;
	var nextDivId = prefix + nextId;

	// base di dati - query complessa
	var data;
	// elementi in uscita alla vista attuale
	var dataOut;
	// variabile relativa al wrapper della mappa
	var map;

	// creazione della barra dei bottoni
	$('#' + destinationDivId).append('<div id="' + divId + '" class="viewer">' + '<div class="view-header"><div id="' + prefix + 'droppable-' + id + '" class="droppable">&nbsp;</div><div class="view-buttons"><form id="' + formId + '"></form></div></div><div id="' + bodyDivId + '" class="viewer-body">&nbsp;</div></div>');
	//$("#" + divId).resizable();

	// conservo id DOM del container precedente
	$("#" + divId).data("prev", prevDivId);
	// conservo id DOM del prossimo container

	var fieldset = createFieldset(id, formId, ["tutti", "solo selezionati"]);
	$("input", fieldset).on('click', function(e, forceVal) {
		oldVal = val;

		// per forzare l'aggiornamento quando si cambia la vista'
		val = forceVal ? forceVal : $(this).val();

		if (val == 'tutti') {
			all = true;
		} else
			all = false;

		$("#" + divId).trigger('stateChanged', [ forceVal ? true : false, oldVal != val ? true : false, forceVal ? true : false]);
	});

	// creazione menu del viewer con opzioni
	var selectMenu = createSelectMenu(id, formId, containerOptions);

	var menuItems = [{
		"label" : "Elimina viewer",
		"icon" : "close",
		"click" : function(e) {
			if (id != 0) {

				var prevDivId = $("#" + divId).data("prev");
				var nextDivId = $("#" + divId).data("next");

				// assegno il viewer successivo all'attuale al precedente viewer della catena
				$("#" + prevDivId).data("next", $("#" + divId).data("next"));
				// duale
				$("#" + nextDivId).data("prev", $("#" + divId).data("prev"));

				// rimuove il viewer attuale
				console.log(divId);
				$("#" + divId).remove();
				// e la nuvola associata
				$("#" + prefix + "droppable-" + id).remove();

				//scateno il cambiamento nella catena dal viewer precedente in poi del viewer eliminato
				// e quindi anche dell'ex successivo
				$("#" + prevDivId).trigger('stateChanged', [true, false, true]);
			}
		}
	}, {
		"label" : "Aggiungi viewer a cascata",
		"icon" : "plus",
		"click" : function(e) {
			
			// aggiunge viewer a cascata
			// assegno il nuovo id al viewer da creare
			var newId =	maxContainerIds;
			maxContainerIds++;
			
			// assegno come sorgente l'attuale cioè 'id'
			console.log('newId',newId);
			Viewer(destinationDivId, containerOptions, newId, id, newId + 1);
			// e scateno l'evento nel container precedente
			var prevDivId = $("#" + divId).data("prev");
			$("#" + prevDivId).trigger('stateChanged', [true, false, true]);
			
		}
	}, {
		"label" : "Salva",
		"icon" : "disk",
		"data" : dataOut,
		"type" : "save",
		"click" : function(e) {
			// save button
			$(e).trigger('save', ['data.json', dataOut]);
		}
	}, {
		"label" : "Apri",
		"icon" : "folder-open",
		"type" : "open",
		"click" : function(e) {
			// open  button
			$(e).trigger('open', divId);
		}
	}];

	$("#" + divId).on('success', function(e, dataIn) {
		data = jQuery.parseJSON(dataIn);
		dataView = clone(data);

		$("#" + divId).trigger('stateChanged', [true, false, true]);
	});

	var form = $("#" + divId + " form");
	UICompactMenu(form, menuItems, {
		css_class : 'settings',
		image : 'base/images/settings.png',
	});

	// inizializzazioni
	var viewOption = containerOptions[0];
	var type = "table";
	var all = true;
	var active = [];
	var selectedIdList = [];
	var idList = [];
	var idField = getIdField();
	var dataView = [];

	function getIdField() {
		if (data == null || !testView())
			return null;
		else {// ritorna il campo id se definito nella view altrimenti usa il prmo campo di columns
			return data["views"][viewOption].id ? data["views"][viewOption].id : data["views"][viewOption].columns[0];
		}
	}

	function testView() {
		if (data["views"][viewOption] == null || data["views"] == null) {
			$("#" + bodyDivId).html("I dati non consentono questa visualizzazione");
			return false;
		}
		return true;
	}


	selectMenu.on('change', function(e) {

		viewOption = $(this).val();

		if (!testView())
			return;

		type = data["views"][viewOption].type;
		selectedIdList = [];
		idField = getIdField();

		// scatena l'evento tutti per riaggiornare il viewer e gli altri a cascata
		$("#" + formId + '-radio-choice-' + 0 + '-fieldset-' + id).trigger("click", ["tutti"]);
	});

	// salvataggio dati con JQUERY
	$("#" + divId).data("id", id);
	$("#" + divId).data("next", nextDivId);
	$("#" + divId).data("prev", prevDivId);
	console.log("nextDivId", nextDivId);
	console.log("prevDivId", prevDivId);

	// azione relatia al click del mouse su un elemento della mappa
	$("#" + bodyDivId).on("mapClicked", function(t, idValue, isSelected) {

		//console.log("mapClicked", idValue, isSelected);
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
		if (!testView())
			return;
		// rimuove i duplicati
		//console.log("dataView", dataView);
		var elementsUnique = dataView.elements.removeDuplicates(idField);

		//console.log("elementsUnique", elementsUnique);

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
		var columns = data["views"][viewOption].columns;
		elementsUnique = elementsUnique.project(columns);

		// creazione nuovo oggetto per avere i campi per il viewer selezionato

		dataOut = {};
		dataOut.id = id;
		dataOut.name = viewOption + "-" + id;
		dataOut.elements = elementsUnique;
		dataOut["views"] = {};
		//console.log("type", type);
		//console.log("data", data);
		//console.log("data['views'][type]", data["views"][viewOption].type);
		dataOut["views"][viewOption] = data["views"][viewOption];

		// esclude il primo dei container
		if (id != 0)
			createDraggableCloud(prefix + "droppable-" + id, dataOut);

		//console.log("elementsUnique", elementsUnique);

		if (map == null || viewChanged)
			initMap(elementsUnique);
		else if (!mapClicked)
			map.draw(elementsUnique, selectedIdList);

		if (viewChanged || sourceChanged || mapClicked) {
			// recupero il div del viewer successivo
			var nextDivId = $("#" + divId).data("next");
			updateNextContainer(map, data, selectedIdList, nextDivId, sourceChanged, mapClicked);
		}

	});

	function updateNextContainer(map, data, selectedIds, nextDivId, sourceChanged, mapClicked) {

		var idField = getIdField();
		$("#" + nextDivId).trigger("sourceChanged", [data, idField, !all ? selectedIdList : idList]);
	}


	$("#" + divId).on("sourceChanged", function(t, dataSource, idFieldSource, selectedSource) {

		// inizializzazione data del container (base di dati)
		if (dataSource != null) {
			data = dataSource;
			dataView = clone(data);
			//console.log("dataView", dataView);
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

		var viewOptions = data["views"][viewOption];

		$("#" + bodyDivId).html("");
		switch(type) {
			case "table":
				map = new Table(bodyDivId, viewOptions.id, elementsUnique, {
					image : viewOptions.image
				});
				break;
			case "geomap":
				map = new GeoMap(bodyDivId, viewOptions.id, elementsUnique, {
					name : viewOptions.name
				});
				break;
			case "timeline":

				map = new Timeline(bodyDivId, viewOptions.id, elementsUnique, {
					name : viewOptions.name,
					width : "99%",
					height : "420px"
				});
				//map.draw(elementsUnique);

				break;
			case "tree":
				map = new Tree(bodyDivId, viewOptions.id, elementsUnique, {
					name : "nomeEvento"
				});
				break;
		}

	}

	var oldVal;
	var val;
	function createFieldset(id, formId, options) {
		var form = $("#" + formId);
		form.append('<fieldset id="' + formId + '-fieldset-' + id + '" data-role="controlgroup" data-type="horizontal"></fieldset>');

		var fieldset = $("#" + formId + "-fieldset-" + id);
		var sourceChanged;

		for (var i = 0; i < options.length; i++) {
			var inputId = formId + '-radio-choice-' + i + '-fieldset-' + id;
			fieldset.append('<input type="radio" name="' + inputId + '" id="' + inputId + '" value="' + options[i] + '" />');
			fieldset.append('<label for="' + inputId + '">' + options[i] + '</label>');

			$("#" + inputId).on('click', function(e) {
				var label = $("label", form);
				if (label.hasClass('ui-btn-active'))
					label.removeClass("ui-btn-active");
				else {
					label.addClass('ui-btn-active');
					$(this).attr("checked", true);
				}
			});
		}

		form.trigger("create");
		//fieldset.controlgroup("refresh");
		$("#" + formId + '-radio-choice-' + 0 + '-fieldset-' + id).attr("checked", true).checkboxradio("refresh");

		return fieldset;

	}

	function createSelectMenu(id, formId, options) {
		var form = $("#" + formId);
		form.append('<select name="menu" id="' + formId + '-select-menu-' + id + '" data-mini="true"></select>');

		var select = $("#" + formId + "-select-menu-" + id);
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

	function createButton(id, form, options) {

	}

	function createDatePicker(id, form, options) {
		form.append('<div style="width: 200px;"><label for="datepicker-' + id + '">Some Date</label><input name="datepicker-' + id + '" id="datepicker-' + id + '" ></div>');

		$("#datepicker-" + id).datepicker();
	}

}

