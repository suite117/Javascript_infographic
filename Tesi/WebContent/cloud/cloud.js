var svg;
var scale = 1;
var divSVG;
var wrapper;
var g;
var idDOM;
var clouds = new Array();

var STATE = {
	NONE : "",
	ACTIVE : "active",
	UNDER : "under",
	DRAGGABLE : "draggable"
};

//initialize the clouds, idDOM is the target DOM element
function initClouds(idDOM) {

	divSVG = d3.select(idDOM);
	idDOM = idDOM;
	var width = "100%";
	var height = 300;

	$("#debug").text("a");

	for (var i = 0; i < 3; i++)
		clouds[i] = {
			id : i,
			elements : [i + 1, i * 2 + 2, i * 3 + 3],
		};

	for (var i = 0; i < 3; i++) {
		clouds[i].x = 200 * i;
		clouds[i].y = 0;
		clouds[i].scale = 0.5;
		clouds[i].state = STATE.NONE;
	}

	function draw() {

		var zoomBehavior = d3.behavior.zoom().on("zoom", zoom);
		svg = divSVG.append("svg").attr("width", width).attr("height", height).call(zoomBehavior);

		wrapper = svg.append("g");

		// prepara la variabile g per l'aggiunta a cascata di attributi
		g = wrapper.selectAll("g").data(clouds).enter().append("g");

		g.attr("class", "cloud").attr("id", function(d) {
			return "cloud" + d.id;
		}).attr("transform", transform)

		var path = g.append("path");
		path.attr("d", "M 410.67959,194.3815 C 392.37515,189.47681 373.85117,195.08975 361.06312,207.28351 C 354.38189,199.25271 345.33513,193.05458 334.48394,190.1472 C 306.55725,182.66441 277.78779,199.27435 270.3048,227.20111 C 269.75493,229.25318 269.61017,231.31674 269.31528,233.36915 C 244.16592,230.75487 220.10196,246.49902 213.35064,271.69554 C 206.66103,296.6615 219.28468,322.19 241.97368,332.68633 C 240.74035,335.36078 239.59041,338.11603 238.80258,341.05587 C 231.31972,368.98263 247.94629,397.69032 275.87305,405.17311 C 289.55164,408.83877 303.37499,406.6863 314.85002,400.29682 C 321.17421,413.82629 332.96537,424.71545 348.50905,428.8801 C 370.68656,434.82265 393.19111,425.40916 405.34082,407.36649 C 410.26235,410.85061 415.73285,413.73264 421.89508,415.3841 C 449.82177,422.86689 478.52936,406.24005 486.01235,378.31329 C 489.77522,364.2703 487.44688,350.05895 480.65432,338.41184 C 487.37673,332.00174 492.63872,323.88203 495.21692,314.25995 C 502.69988,286.33286 486.07327,257.62517 458.14659,250.14238 C 455.20678,249.35502 452.26201,248.91147 449.32995,248.64237 C 451.06775,224.11827 435.30606,200.98024 410.67959,194.3815 z");

		g.append("text").attr("class", "list").attr("x", 100).attr("y", 50).attr("transform", "translate(204,245)").text(function(d) {
			return d.id + " " + d.elements;
		});

		// rect's button container coordinates
		var x = 150;
		var y = 80;

		// add union button
		var button = g.append("g").attr("class", "button").attr("transform", "translate(0,180)");
		button.append("rect").attr("x", x - 10).attr("y", y - 37).attr("width", 200).attr("height", 50);
		button.append("text").attr("x", x).attr("y", y).text(function(d) {
			return "unione";
		});
		button.on("click", function(d, i) {

			// select the cloud under the selected cloud
			var set = svg.select("g." + STATE.UNDER);

			var b = set.data()[0];

			// add elements of overlying set to active set
			d.elements.union(b.elements);

			// remove overlying set from data
			//clouds.remove(b.id);

			// remove svg and redraw
			divSVG.select("svg").remove();
			draw();

		});

		// add intersection button
		y += 50;
		button = g.append("g").attr("class", "button").attr("transform", "translate(0,180)");
		button.append("rect").attr("x", x - 10).attr("y", y - 37).attr("width", 200).attr("height", 50);
		button.append("text").attr("x", x).attr("y", y).text(function(d) {
			return "intersezione";
		});
		button.on("click", function(d, i) {

			// select the cloud under the selected cloud
			var set = svg.select("g." + STATE.UNDER);

			var b = set.data()[0];

			// add elements of overlying set to active set
			var intersect = d.elements.intersect(b.elements);

			// remove overlying set from data
			clouds.remove(d.id);
			clouds.remove(b.id);

			var d2 = clone(d);
			d2.elements = intersect;
			clouds.push(d2);

			// remove svg and redraw
			divSVG.select("svg").remove();
			draw();

		});

		// add difference button
		y += 50;
		button = g.append("g").attr("class", "button").attr("transform", "translate(0,180)");
		button.append("rect").attr("x", x - 10).attr("y", y - 37).attr("width", 200).attr("height", 50);
		button.append("text").attr("x", x).attr("y", y).text(function(d) {
			return "differenza";
		});
		button.on("click", function(d, i) {

			// select the cloud under the selected cloud
			var set = svg.select("g." + STATE.UNDER);

			var b = set.data()[0];

			// add elements of overlying set to active set
			d.elements.difference(b.elements);

			// remove overlying set from data
			clouds.remove(b.id);

			// remove svg and redraw
			svg.remove();
			draw();

		});

		// add event listener on drag event
		var dragBehavior = d3.behavior.drag().on("drag", drag);
		g.call(dragBehavior);

	}

	draw();

	function drag(d, index) {
		d.x += d3.event.dx;
		d.y += d3.event.dy;

		//$("#debug").text(d.x + " " + d.y);

		if (d.state != STATE.DRAGGABLE && (d.y > 130)) {
			d.state = STATE.DRAGGABLE;
			d3.select(this).call(d3.behavior.drag().on("drag", null));
			//console.log(this);
			//confirm('Drag this cloud?');

			d.x = -51;
			d.y = -45;
			d3.select(this).attr("transform", transform);

			var svgCloud = d3.select("#draggable-container div#draggable-" + d.id);
			//console.log(svgCloud[0][0]);
			if (svgCloud[0][0] == null) {
				svgCloud = d3.select("#draggable-container").append("div").attr("class", "draggable").attr("id", "draggable-" + d.id).append("svg");
			}

			var g = svgCloud.append("g").attr("class", "cloud").attr("transform", "translate(" + d.x + "," + d.y + "), scale(0.3)");

			// create the new cloud
			var list = [];
			list.push(d);
			var n = g.selectAll("path").data(list).enter();

			var pathContent = d3.select(this).select("path")[0][0].getAttribute("d");
			n.append("path").attr("d", pathContent);

			var textContent = d3.select(this).select("text")[0][0].textContent;
			//console.log(textContent);
			n.append("text").attr("x", 100).attr("y", 50).attr("transform", "translate(193,255)").text(textContent);

			clouds.remove(d.id);
			d3.select(this).remove();

			createDraggableCloud(d);

			return;
		}

		d3.select(this).attr("transform", transform);

		// fix z-index of selected element
		this.parentNode.appendChild(this);

		var showMenu = false;
		d.state = STATE.ACTIVE;

		// test se sono vicini
		var g = svg.selectAll("g.cloud");
		for (var i = 0; i < g.data().length; i++) {
			var d2 = g.data()[i];
			var otherNode = svg.select("#cloud" + d2.id);
			var dis = distance(d, d2);

			otherNode.attr("class", "cloud " + d2.state);
			// se non è l'attuale nodo selezionato
			if (d.id != d2.id) {

				if (dis < 50 * scale) {
					d2.state = STATE.UNDER;

					showMenu = true;
					break;
				} else
					d2.state = STATE.NONE;
			}

		}

		if (showMenu)
			d3.select(this).selectAll("g.button").style("visibility", "visible");
		else
			d3.select(this).selectAll("g.button").style("visibility", "hidden");

	}

}

function zoom() {
	scale = d3.event.scale;
	var xy = d3.event.translate;
	wrapper.attr("transform", "translate(" + xy[0] + "," + xy[1] + ")" + ", scale(" + d3.event.scale + ")").style("stroke-width", 1 / d3.event.scale);
}

function transform(d) {
	return "translate(" + d.x + "," + d.y + "), scale(" + d.scale + ")";
}

//returns the distance between two clouds
function distance(d1, d2) {
	return Math.sqrt((d1.x - d2.x) * (d1.x - d2.x) + (d1.y - d2.y) * (d1.y - d2.y));
}

function getCentroid(selection) {
	// get the DOM element from a D3 selection
	// you could also use "this" inside .each()
	var element = selection.node(),
	// use the native SVG interface to get the bounding box
	bbox = element.getBBox();
	// return the center of the bounding box
	console.log("bbox: " + bbox);
	return [bbox.x + bbox.width / 2, bbox.y + bbox.height / 2];
}

function zoom2(d) {

	var centroid = getCentroid(d3.select(this));

	x = centroid[0];
	y = centroid[1];
	scale = 3.5;

	console.log(centroid);
	console.log(scale);

	svg.transition().duration(1000).attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + scale + ")translate(" + -x + "," + -y + ")");
	svg.style("stroke-width", 1.5 / scale + "px");
	//svg.attr("transform", "translate(" + r * Math.cos(theta) + "," + r * Math.sin(theta) + ")" + ", scale(" + scale + ")").style("stroke-width", 1 / scale);
}

function createDraggableCloud() {

	var dragId;
	$(".draggable").draggable({
		// non ritorna al proprio posto
		revert : false,
		cursor : "move",
		appendTo : ".view-container .view-header",
		stop : function(event, ui) {
			// drag stop

			dragId = this;
			//console.log(dragId);
		}
	});

	// select the view
	$(".view-container .view-header").droppable({
		tolerance : 'touch',
		over : function() {
			$(this).removeClass('out').addClass('over');
		},
		out : function() {
			$(this).removeClass('over').addClass('out');
		},
		drop : function() {
			//var answer = confirm('Permantly delete this item?');
			// this = header sottostante

			if ($(dragId) && !jQuery.isEmptyObject(dragId)) {
				//$(this).append(dragId);
				console.log($(dragId));
				var id = $(dragId).attr("id").split("-")[1];
				
				console.log(clouds);
				$(this).text(clouds.find(id));
			}
			$(this).removeClass('over').addClass('out');
		}
	});
}