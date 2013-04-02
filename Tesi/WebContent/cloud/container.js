var containerId = 0;
function createContainer() {

	var id = containerId++;
	var prefix = 'view-container-';
	var divId = prefix + id;
	var nextId = id + 1;

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

	$(document).ready(function() {
		// container listener
		$("#" + divId).data("id", id);

		$("#" + divId).on("dataChange", function(d, param1, param2) {

			var nextContainer = $(d.currentTarget);
			var nextId = $(d.currentTarget).data().id;
			$("#" + prefix + nextId + " .view-container-body").text("ciao sono " + id);
			updateNextContainer(id + 1);

			console.log(nextContainer.data());
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
				// this = header sottostante
				var offset = $(this).offset();
				var x = offset.left;
				var y = offset.top;

				for (var k = 0; k < draggers.length; k++) {

					var d = $(draggers[k]).data().d;

					var x1 = d.x;
					var y1 = d.y;

					var dis = distance([x, y], [x1, y1]);
					//console.log([x, y] + " " + [x1, y1] + " " + dis);
					//console.log("el ", d.elements);

					if (dis < 100) {
						var map;
						var destinationDivId = "view-container-body-" + id;
						$("#" + destinationDivId).html("");
						if (d.type == TYPE.SET)
							map = new Table(destinationDivId, "table-" + id, d.elements);
						else if (d.type == TYPE.GEOMAP)
							map = new GeoMap(destinationDivId, "geomap-" + id, d.elements);
						break;
					}
				}
				$(this).removeClass('over').addClass('drop');
				updateNextContainer(nextId);

			}
		});

	});

	function updateNextContainer(destinationId) {
		$("#" + prefix + destinationId).trigger("dataChange", ['Pass', 'Along', 'Parameters']);
	}

}

