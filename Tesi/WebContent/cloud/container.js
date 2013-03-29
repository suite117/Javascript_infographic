var containerId = 0;
function createContainer() {

	var id = containerId++;

	$("#views-container").append('<div id="view-container-' + id + '" class="view-container">' + '<div class="view-header"><div class="droppable">&nbsp;</div><div class="view-buttons"><form></form></div></div><div class="view-body"><div class="content">&nbsp;</div></div></div>');

	var form = $("#view-container-" + id + " form");

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
		// select the view
		$("#view-container-" + id + " .droppable").droppable({
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
						//$("#view-container-" + id + " .view-body .content").text(
						Table("#view-container-" + id + " .view-body .content", "table-" + id, d.elements);
						break;
					}
				}
				$(this).removeClass('over').addClass('drop');
			}
		});

	});
}

