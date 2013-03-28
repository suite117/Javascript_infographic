var containerId = 0;
function createContainer() {

	var id = containerId++;

	$("#views-container").append('<div id="view-container-' + id + '" class="view-container">' + '<div class="view-header">&nbsp;</div><div class="view-body">&nbsp;</div></div>');

	$(document).ready(function() {
		// select the view
		$("#view-container-" + id + " .view-header").droppable({
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
						$("#view-container-" + id + " .view-body").text(d.id + " " + d.elements);
						break;
					}
				}
				$(this).removeClass('over').addClass('out');
			}
		});

	});
}

