var svg;
var scale = 1;
var divSVG;
var g;

var STATE = {
	NONE : "",
	ACTIVE : "active",
	UNDER : "under"
};
function initClouds(idDOM) {

	divSVG = d3.select(idDOM);

	var width = "100%";
	var height = 600;

	$("#debug").text("a");
	$("#debug").append("");

	var clouds = new Array();
	for (var i = 0; i < 3; i++)
		clouds[i] = {
			id : i,
			x : 200 * i,
			y : 0,
			scale : 0.5,
			elements : [i + 1, i * 2 + 2, i * 3 + 3],
			state : STATE.NONE
		};

	function draw() {

		var zoomBehavior = d3.behavior.zoom().on("zoom", zoom);
		svg = divSVG.append("svg").attr("width", width).attr("height", height).call(zoomBehavior).append("g");

		// prepara la variabile g per l'aggiunta a cascata di attributi
		g = svg.selectAll("g").data(clouds).enter().append("g");

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
		button.append("rect").attr("x", x - 10).attr("y", y - 37).attr("width", 150).attr("height", 50);
		button.append("text").attr("x", x).attr("y", y).text(function(d) {
			return "unione";
		});
		button.on("click", function(d, i) {

			// select the cloud under the selected cloud
			var sets = svg.select("g." + STATE.UNDER);
			for (var i = 0; i < sets.length; i++) {
				var b = sets.data()[i];

				// add elements of overlying set to active set
				d.elements.union(b.elements);

				// remove overlying set from data
				clouds.remove(b.id);
			}

			// remove svg and redraw
			divSVG.select("svg").remove();
			draw();

		});

		// add intersection button
		y += 50;
		button = g.append("g").attr("class", "button").attr("transform", "translate(0,180)");
		button.append("rect").attr("x", x - 10).attr("y", y - 37).attr("width", 150).attr("height", 50);
		button.append("text").attr("x", x).attr("y", y).text(function(d) {
			return "intersezione" + d.id;
		});

		// add event listener on drag event
		var dragBehavior = d3.behavior.drag().on("drag", drag);
		g.call(dragBehavior);

	}

	draw();

	function drag(d, index) {
		d.x += d3.event.dx;
		d.y += d3.event.dy;
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

		//d3.select(this).attr("class", "cloud " + d.state);

		if (showMenu)
			d3.select(this).selectAll("g.button").style("visibility", "visible");
		else
			d3.select(this).selectAll("g.button").style("visibility", "hidden");

	}

}

function zoom() {
	scale = d3.event.scale;
	svg.selectAll("g path").style("stroke-width", 10 / scale);
	svg.attr("transform", "translate(" + d3.event.translate + ")" + "scale(" + d3.event.scale + ")").style("stroke-width", 1 / d3.event.scale);
}

function transform(d) {
	return "translate(" + d.x + "," + d.y + "), scale(" + d.scale + ")";
}

function distance(d1, d2) {
	return Math.sqrt((d1.x - d2.x) * (d1.x - d2.x) + (d1.y - d2.y) * (d1.y - d2.y));
}

