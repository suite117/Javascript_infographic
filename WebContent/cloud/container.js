// creazione del contenitore dei viewer
// 'maxContainerIds' variabile globale che tiene conto dell'id (intero attuale massimo)
maxContainerIds = 0;
function createContainer(destinationDivId, containerOptions, defaultOption,
		viewerNumber, optional) {

	for ( var i = 0; i < viewerNumber; i++) {
		Viewer(destinationDivId, containerOptions, defaultOption, i, i - 1,
				i + 1, optional);
		maxContainerIds++;
	}
	// abilito il trascinamento del container dei viewer
	// $("#" + destinationDivId).draggable();
	if (optional && optional.isGenerator) {
		$("#" + destinationDivId).append('<div id="bubble_values"></div>');
		createCloudGenerator(destinationDivId, containerOptions,
				optional.domain);
	}
}

function Viewer(destinationDivId, viewerOptions, defaultOption, id, prevId,
		nextId, optional) {

	// inizializzazioni
	var isGenerator = false;
	// Se è un generatore verranno fornite le tabelle sorgenti
	var dataInput;
	if (optional) {
		isGenerator = optional.isGenerator ? optional.isGenerator : isGenerator;
		dataInput = optional["data-input"] ? optional["data-input"] : dataInput;
	}

	// prefisso globale del viewer
	var prefix = destinationDivId + '_viewer_';
	// id DOM del div principale del viewer
	var divId = prefix + id;
	// id DOM del div che contiene la mappa
	var bodyDivId = prefix + "viewer_body_" + id;
	// id DOM del form contenente i pulsanti
	var formId = divId + '_form';

	// id DOM del viewer precedente e successivo
	var prevDivId = prefix + prevId;
	var nextDivId = prefix + nextId;

	// base di dati - query complessa
	var data = null;
	// variabile contenente l'oggetto caricato dal file
	// "data/[domainName].dom.json"
	var domain;
	// variabile contenente l'oggetto caricato dal file
	// "data/[domainName].vod.json"
	var domainDescription = null;
	// elementi in uscita alla vista attuale
	var dataOut;
	// variabile relativa al wrapper della mappa
	var map;

	// opzione che seleziona l'elemento attuale
	var viewOption = defaultOption ? defaultOption : viewerOptions[0];
	// tipo di mappa da utilizzare
	var type;
	// true - se il pulsante tutti è attivo
	var all = true;
	// lista di tutti gli id selezionati
	var selectedIdList = [];
	// lista di tutti gli id
	var idList = [];
	// campo id per la proiezione attuale
	var idField = getIdField();
	// base di dati per la proiezione corrente
	var dataView = [];

	// variabile che punta all'autocompletamento
	var $autoCompleteTxt = null;

	// creazione della barra dei bottoni
	var divContent = '<div id="'
			+ divId
			+ '" class="viewer">'
			+ '<div class="view-header"><div id="'
			+ prefix
			+ 'droppable-'
			+ id
			+ '" class="droppable">&nbsp;</div><div class="view-buttons"><form id="'
			+ formId + '"></form></div></div><div id="' + bodyDivId
			+ '" class="viewer-body">&nbsp;</div></div>';

	if (id == 0) {
		$('#' + destinationDivId).append(divContent);
	} else
		$("#" + prevDivId).after(divContent);

	// css fix for Chrome and IE
	if (!isGenerator && navigator.userAgent.indexOf("Firefox") == -1) {
		$("#" + bodyDivId).css("top", "-72px");
	}

	// Se è un generatore elimino il tondino per l'aggancio della nuvola
	if (isGenerator)
		$(".droppable", $('#' + destinationDivId)).css("display", "none");

	$("#" + divId).resizable();
	// fix - imposto timeout in ms per aggiornare la mappa quando si
	// ridimensiona
	var doit = null;
	$("#" + divId).resize(function() {
		clearTimeout(doit);
		doit = setTimeout(function() {
			$("#" + divId).trigger('stateChanged', [ true, false, true ]);
		}, 500); // durata timeout
	});

	// conservo id DOM del viewer precedente
	$("#" + divId).data("prev", prevDivId);

	if (!isGenerator) {
		var fieldset = createFieldset(id, formId,
				[ "tutti", "solo selezionati" ]);
		var oldVal;
		var val;
		$("input", fieldset).on(
				'click',
				function(e, forceVal) {
					oldVal = val;

					// per forzare l'aggiornamento quando si cambia la vista'
					val = forceVal ? forceVal : $(this).val();

					if (val == 'tutti') {
						all = true;
					} else
						all = false;

					$("#" + divId).trigger(
							'stateChanged',
							[ forceVal ? true : false,
									oldVal != val ? true : false,
									forceVal ? true : false ]);
				});
	}

	// creazione menu del viewer con opzioni
	var selectMenu = createSelectMenu(id, formId, viewerOptions, defaultOption);

	var menuItems = [
			{
				"label" : "Elimina viewer",
				"icon" : "close",
				"click" : function(e) {
					if (id != 0) {

						var prevDivId = $("#" + divId).data("prev");
						var nextDivId = $("#" + divId).data("next");

						// assegno il viewer successivo all'attuale al
						// precedente viewer della catena
						$("#" + prevDivId).data("next",
								$("#" + divId).data("next"));
						// duale
						$("#" + nextDivId).data("prev",
								$("#" + divId).data("prev"));

						// rimuove il viewer attuale
						// console.log(divId);
						$("#" + divId).remove();
						// e la nuvola associata
						$("#" + prefix + "droppable-" + id).remove();

						// scateno il cambiamento nella catena dal viewer
						// precedente in poi del viewer eliminato
						// e quindi anche dell'ex successivo
						$("#" + prevDivId).trigger('stateChanged',
								[ true, false, true ]);
					}
				}
			},
			{
				"label" : "Aggiungi viewer a cascata",
				"icon" : "plus",
				"click" : function(e) {

					// aggiunge viewer a cascata
					// assegno il nuovo id al viewer da creare
					var newId = ++maxContainerIds;

					var oldNextDivId = $("#" + divId).data("next");

					// assegno come sorgente l'attuale cioè viewer con id = 'id'
					Viewer(destinationDivId, viewerOptions, viewOption, newId,
							id, $("#" + oldNextDivId).data("id"));

					var newNextDivId = prefix + newId;
					// aggancio il nuovo viewer all'attuale
					$("#" + divId).data("next", newNextDivId);
					// assegno il nuovo viewer come sorgente del viewer
					// percedente nella successione
					$("#" + oldNextDivId).data("prev", newNextDivId);

					// console.log('nextDivId', nextDivId);
					// console.log('newNextDivId', newNextDivId);

					// e scateno l'evento nel viewer precedente
					updateNextViewer(data, newNextDivId);

				}
			}, {
				"label" : "Salva",
				"icon" : "disk",
				"data" : dataOut,
				"type" : "save",
				"click" : function(e) {
					// save button
					$(e).trigger('save', [ 'data.json', dataOut ]);
				}
			}, {
				"label" : "Apri",
				"icon" : "folder-open",
				"type" : "open",
				"click" : function(e) {
					// open button
					$(e).trigger('open', divId);
				}
			} ];

	$("#" + divId).on('success', function(e, dataIn) {
		data = jQuery.parseJSON(dataIn);
		dataView = clone(data);

		$("#" + divId).trigger('stateChanged', [ true, false, true ]);
	});

	if (!isGenerator) {
		var form = $("#" + divId + " form");
		UICompactMenu(form, menuItems, {
			css_class : 'settings',
			image : 'base/images/settings.png',
		});
	}

	function getIdField() {
		if (data == null)
			return null;
		else {// ritorna il campo id se definito nella view altrimenti usa il
			// prmo campo di columns
			return domainDescription[viewOption].id ? domainDescription[viewOption].id
					: domain[viewOption].columns[0];
		}
	}

	function testView() {

		if (data.elements == []) {
			$("#" + bodyDivId).html("Insieme vuoto.");
			return false;
		} else if (domainDescription == null
				|| domainDescription[viewOption] == null
				|| data.elements[0][getIdField()] == null) {
			$("#" + bodyDivId).html(
					"I dati non consentono questa visualizzazione");
			return false;
		}
		return true;
	}

	selectMenu.on('change', function(e) {

		viewOption = $(this).val();
		type = domainDescription[viewOption].type;
		selectedIdList = [];
		idField = getIdField();

		if (isGenerator)
			data = dataInput[viewOption];

		if (!testView())
			return;

		if (isGenerator)
			initViewer(data);
		else
			// scatena l'evento tutti per riaggiornare il viewer e gli altri a
			// cascata
			$("#" + formId + '-radio-choice-' + 0 + '-fieldset-' + id).trigger(
					"click", [ "tutti" ]);
	});

	// salvataggio dati con JQUERY
	$("#" + divId).data("id", id);
	$("#" + divId).data("next", nextDivId);
	$("#" + divId).data("prev", prevDivId);

	// azione relatia al click del mouse su un elemento della mappa
	$("#" + bodyDivId)
			.on(
					"mapClicked",
					function(t, idValue, isSelected) {

						// console.log("mapClicked", idValue, isSelected);
						// idValue = il campo id per la selezione attuale
						// isSelected = true se l'elemento è selezionato

						if (isGenerator) {
							var bubbleLabelField = domainDescription[viewOption]["bubble-label"];
							var bubbleValueField = domainDescription[viewOption]["bubble-value"];
							var idField = getIdField();
							// console.log('bubbleLabelField',
							// bubbleLabelField);
							var obj = dataView.elements.findById(idField,
									idValue);

							var txt = obj[bubbleLabelField];
							// console.log(obj, idField, txt, bubbleLabelField);
							var bubbleId;

							if (obj[bubbleValueField] instanceof Array)
								idValue = obj[bubbleValueField].toString()
										.replace(/,/g, "-");
							else
								idValue = obj[bubbleValueField];

							bubbleId = 'bubble-value-' + idValue;

							if (isSelected) {
								var bubbleContent = '<div id="' + bubbleId
										+ '" class="bubble_value">' + txt
										+ '</div>';
								$("#bubble_values").append(bubbleContent);

								if (domainDescription[viewOption].type == "timeline")
									$("#" + bubbleId).data("idValue",
											"'" + idValue + "'");
								else
									$("#" + bubbleId).data("idValue", idValue);

								$("#" + bubbleId)
										.data("viewOption", viewOption)
										.draggable();
							} else {
								$("#" + bubbleId).remove();
							}
						} else {
							if (isSelected) {
								isPresent = false;
								for ( var i = 0; i < selectedIdList.length; i++) {
									if (selectedIdList[i] == idValue) {
										isPresent = true;
										break;
									}
								}
								if (!isPresent)
									selectedIdList.push(idValue);

							} else {

								for ( var i = 0; i < selectedIdList.length; i++)
									if (selectedIdList[i] == idValue) {
										selectedIdList.splice(i, 1);
										break;
									}
							}

							if (!all)
								$("#" + divId).trigger('stateChanged',
										[ false, true, false ]);
						}

					});

	$("#" + divId)
			.on(
					"stateChanged",
					function(t, sourceChanged, mapClicked, viewChanged) {

						// console.log("input to stateChanged " + divId,
						// data.elements);

						// recupero il campo id della proiezione attuale
						var idField = getIdField();
						if (!testView())
							return;

						// console.log("dataView", dataView);
						var elementsUnique;
						if (isGenerator)
							elementsUnique = dataView.elements;
						else
							// rimozione duplicati
							elementsUnique = dataView.elements
									.removeDuplicates(idField);

						// console.log("elementsUnique", elementsUnique);

						idList = [];
						for ( var ii = 0; ii < elementsUnique.length; ii++) {
							idList.push(elementsUnique[ii][idField]);
						}

						if (!all) {
							selected_new = [];
							for ( var i = 0; i < selectedIdList.length; i++) {
								isPresent = false;
								for ( var j = 0; j < idList.length; j++)
									if (selectedIdList[i] == idList[j]) {
										isPresent = true;
										break;
									}
								if (isPresent)
									selected_new.push(selectedIdList[i]);
							}
							selectedIdList = selected_new;
						}

						// proiezione dei campi rispetto alle colonne
						// specificate nella view
						// selezionata
						// recupero le colonne della proiezione
						var columnsAll = domain[viewOption]["columns"];
						if (type == "timeline")
							console.log(columnsAll);
						// test per verificare se i campi di columns sono
						// presenti negli oggetti
						if (elementsUnique[0] != null) {
							columns = [];
							for ( var i = 0; i < columnsAll.length; i++) {
								var column = columnsAll[i];
								if (elementsUnique[0][column] != null)
									columns.push(column);
							}
						} else
							columns = columnsAll;

						var elementsUniqueProj = elementsUnique
								.project(columns);

						// aggiorno i valori per l'autocomplete
						var autoCompleteOptions = domainDescription[viewOption]["autocomplete"];

						if (isGenerator && (!$autoCompleteTxt || viewChanged)) // Creazione
							// widget per
							// l'autocompletamento
							$autoCompleteTxt = createAutoCompleteText(0,
									formId, elementsUniqueProj,
									autoCompleteOptions);

						// creazione nuovo oggetto per avere i campi per del
						// viewer selezionato
						dataOut = {};
						dataOut.id = id;
						dataOut.name = viewOption + "-" + id;
						dataOut.elements = elementsUniqueProj;
						dataOut.domain = data.domain;

						// esclude il primo dei viewer dalla generazione delle
						// nuvole
						if (id != 0)
							createDraggableCloud(prefix + "droppable-" + id,
									dataOut, viewOption);

						// console.log("elementsUniqueProj",
						// elementsUniqueProj);

						if (map == null || viewChanged)
							initMap(domainDescription, elementsUniqueProj);
						else if (!mapClicked)
							map.draw(elementsUniqueProj, selectedIdList);

						if (viewChanged || sourceChanged || mapClicked) {
							// recupero il div del viewer successivo
							var nextDivId = $("#" + divId).data("next");
							updateNextViewer(data, nextDivId);
						}

					});

	function updateNextViewer(data, nextDivId) {

		var idField = getIdField();
		$("#" + nextDivId).trigger(
				"sourceChanged",
				[ domain, domainDescription, data, idField,
						!all ? selectedIdList : idList ]);
	}

	$("#" + divId).on(
			"sourceChanged",
			function(t, domainSource, domainDescrSource, dataSource,
					idFieldSource, selectedSource) {

				// inizializzazione data del viewer (base di dati)
				if (domainSource != null) {
					domain = domainSource;
					domainDescription = domainDescrSource;
					type = domainDescription[viewOption].type;
				}

				if (dataSource != null) {
					data = dataSource;
					dataView = clone(data);
					// console.log("dataView", dataView);
				}

				// inizializzazione base di dati per la view attuale
				dataView.elements = [];
				for ( var i = 0; i < data.elements.length; i++) {
					var element = data.elements[i];
					for ( var j = 0; j < selectedSource.length; j++) {
						if (element[idFieldSource] == selectedSource[j]) {
							dataView.elements.push(element);
							break;
						}
					}
				}

				// aggiorno il contenuto richiamo il viewer successivo a cascata
				$("#" + divId).trigger('stateChanged', [ true, false, false ]);

			});

	// inizializzazione generatore di valori
	if (isGenerator)
		initViewer(dataInput[viewOption]);

	// aggiunge l'evento drop all'etichetta del viewer
	$("#" + divId + " .droppable").droppable({
		tolerance : 'touch',
		over : function() {
			// console.log(id);
			if (id != 0)
				$(this).removeClass('out').addClass('over');
		},
		out : function(event, ui) {
			$(this).removeClass('over').addClass('out');
			// var $draggableCloud = $(ui.draggable);
			// $draggableCloud.css("left", event.pageX);
			// $draggableCloud.css("top", event.pageY);
			// $("#draggable-container").append($draggableCloud);
		},
		// evento nuvola sull'etichetta del viewer
		drop : function(event, ui) {

			if (id != 0)
				return;

			// this = etichetta droppable del viewer sottostante
			var offset = $(this).offset();
			var x = offset.left;
			var y = offset.top;

			var $draggableCloud = $(ui.draggable);

			// recupero le coordinate dei cloud spostabili
			var d = $draggableCloud.data("d");

			// var x1 = d.x;
			// var y1 = d.y;
			// var dis = distance([ x, y ], [ x1, y1 ]);
			// if (dis < 80) {
			if (d != null) {

				// verifico che la nuvola non sia già agganciata
				if ($draggableCloud.parent().attr("id") != $(this).attr("id")) {
					// $(this).append($draggableCloud);
					// $draggableCloud.css("left", "9px").css("top", "6px");
				}

				initViewer(d);
				// break;
			}

			$(this).removeClass('over').addClass('out');

		}
	});

	function initViewer(d) {
		// conservo l'insieme della nuvola
		data = d;
		domain = getJSON("data/" + data["domain"] + ".dom.json");
		domainDescription = getJSON("data/" + data["domain"] + ".vod.json");
		type = domainDescription[viewOption].type;
		dataView = clone(data);
		selectedIdList = [];

		$("#" + divId).trigger('stateChanged', [ true, false, true ]);
	}

	function initMap(domainDescription, elementsUnique) {

		if (elementsUnique == null)
			alert("elementsUnique è null");

		var viewOptions = domainDescription[viewOption];

		$("#" + bodyDivId).html("");
		switch (type) {
		case "table":
			map = new Table(bodyDivId, elementsUnique, viewOptions.id, {
				image : viewOptions.image
			});
			break;
		case "geomap":
			map = new GeoMap(bodyDivId, elementsUnique, viewOptions.id, {
				name : viewOptions.name
			});
			break;
		case "timeline":
			console.log(elementsUnique, viewOptions.id, viewOptions.name);
			map = new Timeline(bodyDivId, elementsUnique, viewOptions.id, {
				name : viewOptions.name,
				width : "99%",
				height : "420px"
			});
			break;
		case "tree":
			map = new Tree(bodyDivId, viewOptions.id, elementsUnique, {
				name : "nomeEvento"
			});
			break;
		}

	}

}

function createCloudGenerator(destinationDivId, containerOptions, domainName) {
	var tableId = destinationDivId + '-cloud-generator';
	var viewOption;
	var outCloudId = 0;

	$("#" + destinationDivId)
			.append(
					'<table id="'
							+ tableId
							+ '" class="cloud-generator"><thead><th></th><th>Inclusi</th><th>Esclusi</th></thead><tbody></tbody></table>');
	for ( var i = 0; i < containerOptions.length; i++) {
		var trId = destinationDivId + '-table-row-' + i;
		var trContent = '<tr id="'
				+ trId
				+ '"><td class="table-noborder">'
				+ containerOptions[i]
				+ '</td><td class="table-content table-included"></td><td class="table-content table-excluded"></td></tr>';
		$("tbody", $("#" + tableId)).append(trContent);
		$("td", $("#" + trId)).data("viewOption", containerOptions[i]);
	}

	$("tbody", $("#" + tableId))
			.append(
					'<tr><td class="table-noborder"></td><td colspan="2" class="table-noborder"><form></form></td></tr>');
	$("form", $("#" + tableId))
			.append(
					'<button class="table-save">Crea Query</button><button class="table-clear">Cancella selezione</button>');
	$("button", $("#" + tableId)).button().click(function(e) {
		// per evitare l'invio del form
		e.preventDefault();
	});

	// gestione evento crea nuvola
	$(".table-save", $("#" + tableId)).click(function(e) {
		var requestObj = {};

		$.each(containerOptions, function(index, option) {
			requestObj[option] = [];
		});

		// recupero i valori dei tondini inclusi ed esclusi
		$.each([ "included", "excluded" ], function(index, inclusion) {
			$('.table-' + inclusion).each(function(index, value) {
				viewOption = $(this).data('viewOption');

				// console.log(index, value, viewOption);
				$("div", $(this)).each(function(index, bubbleDiv) {
					// console.log($(bubbleDiv).text());
					if ($(bubbleDiv).hasClass("bubble_value_selected")) {
						requestObj[viewOption].push({
							"id" : $(bubbleDiv).data("idValue"),
							"included" : inclusion == "included" ? true : false
						});
					}
				});
			});
		});

		console.log("client send: ", requestObj);

		$.ajax({
			url : '/JSONServlet/RequestJoinObject',
			type : 'POST',
			data : JSON.stringify(requestObj),
			// async : false,
			// dataType : 'json',
			error : function() {
				alert("Error Occured");
			},
			success : function(d) {
				console.log("server respond: ", d);
				createDraggableCloud('draggable-container', d, "");
			}
		});
	});

	$(".table-clear", $("#" + tableId)).click(function(e) {
		// cancello gli elementi della tabella
		// $(".table-content",
		// $(this).parent().parent().parent().parent().parent()).html("");
		$(".bubble_value_selected").remove();
	});

	$(".table-content", $("#" + destinationDivId)).droppable(
			{
				tolerance : 'touch',
				over : function(event, ui) {
					var $draggableBubble = $(ui.draggable);
					var bubbleOption = $draggableBubble.data("viewOption");
					var viewOption = $(this).data("viewOption");

					if (bubbleOption == viewOption)
						$(this).addClass('over');
				},
				out : function(event, ui) {
					var $draggableBubble = $(ui.draggable);
					if ($draggableBubble.hasClass('bubble_value_selected'))
						$($draggableBubble).addClass('bubble_value')
								.removeClass('bubble_value_selected');
					$(this).removeClass('over');
					// $("#bubble_values").append($draggableBubble);
				},
				// evento nuvola sull'etichetta del viewer
				drop : function(event, ui) {
					var $draggableBubble = $(ui.draggable);
					var bubbleOption = $draggableBubble.data("viewOption");
					var viewOption = $(this).data("viewOption");

					if (bubbleOption == viewOption) {
						// $draggableBubble.draggable('disable');

						$draggableBubble.css("left", 0).css("top", 0).addClass(
								'bubble_value_selected').removeClass(
								'bubble_value');
						$(this).append($draggableBubble);
					}
				}
			});

	$("#" + destinationDivId)
			.append(
					'<div id="draggable-container" class="draggable-container">&nbsp;</div>');
}

function createFieldset(id, formId, options) {
	var form = $("#" + formId);
	form.append('<fieldset id="' + formId + '-fieldset-' + id
			+ '" data-role="controlgroup" data-type="horizontal"></fieldset>');

	var fieldset = $("#" + formId + "-fieldset-" + id);

	for ( var i = 0; i < options.length; i++) {
		var inputId = formId + '-radio-choice-' + i + '-fieldset-' + id;
		fieldset.append('<input type="radio" name="' + inputId + '" id="'
				+ inputId + '" value="' + options[i] + '" />');
		fieldset.append('<label for="' + inputId + '">' + options[i]
				+ '</label>');

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
	// fieldset.controlgroup("refresh");
	$("#" + formId + '-radio-choice-' + 0 + '-fieldset-' + id).attr("checked",
			true).checkboxradio("refresh");

	return fieldset;

}

function createSelectMenu(id, formId, options, defaultOption) {
	var form = $("#" + formId);
	form.append('<select name="menu" id="' + formId + '-select-menu-' + id
			+ '" data-mini="true"></select>');

	var select = $("#" + formId + "-select-menu-" + id);
	for ( var i = 0; i < options.length; i++) {
		var selected = options[i] == defaultOption ? "selected" : "";
		select.append('<option ' + selected + ' value="' + options[i] + '">'
				+ options[i] + '</option>');
	}

	select.selectmenu();

	return select;
}

function createAutoCompleteText(number, formId, data, autoCompleteOpt) {

	var autoCompleteOptions = autoCompleteOpt;
	var autoComplTxtId = formId + '-autocomplete-' + number;

	// rimozione etichetta e input field
	var $autoComplTxtDiv = $("#" + autoComplTxtId);
	$autoComplTxtDiv.remove();

	var form = $("#" + formId);
	form.append('<div id="' + autoComplTxtId + '" <label for="'
			+ autoComplTxtId + '">Cerca: </label>'
			+ '<input type="text" /></div>');

	// seleziono il campo input appena creato
	var $autoComplInput = $("input", $("#" + autoComplTxtId));
	console.log("autoComplInput", $autoComplInput.data());

	$autoComplInput.autocomplete({
		minLength : 0,
		source : function(request, response) {
			var matches = $.map(data, function(item) {
				// console.log("request.term", request.term);
				// console.log("item", item);
				if (item[autoCompleteOptions.label].toUpperCase().indexOf(
						request.term.toUpperCase()) != -1) {
					return item;
				}
			});
			response(matches);
		},
		focus : function() {
			return false;
		},

		select : function(event, ui) {
			// $(this).val(ui.item[autoCompleteOptions.label] + " / " +
			// ui.item[autoCompleteOptions.value]);
			// return false;
		}
	});

	$autoComplInput.data("ui-autocomplete")._renderItem = function(ul, item) {
		// var autoCompleteOptions =
		// $autoComplTxtDiv.data("autoCompleteOptions");
		return $("<li></li>").data("ui-autocomplete-item", item).append(
				"<a><strong>" + item[autoCompleteOptions.label]
						+ "</strong></a>").appendTo(ul);
		// item[autoCompleteOptions.value]
	};

	return $autoComplTxtDiv;
}

function createSelectSlider(id, form, options) {
	form.append('<select name="slider" id="flip-' + id
			+ '" data-role="slider"></select>');

	var select = $("#flip-" + id);
	for ( var i = 0; i < options.length; i++) {
		select.append('<option value="' + options[i] + '">' + options[i]
				+ '</option>');
	}

	select.slider();

	return select;
}

function createDatePicker(id, form, options) {
	form.append('<div style="width: 200px;"><label for="datepicker-' + id
			+ '">Some Date</label><input name="datepicker-' + id
			+ '" id="datepicker-' + id + '" ></div>');

	$("#datepicker-" + id).datepicker();
}
