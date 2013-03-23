var divSVG;
var idDOM;
function initClouds(id) {
	idDOM = id;
	divSVG = d3.select(idDOM);

	var width = "100%";
	var height = 600;

	var svg = divSVG.append("svg").attr("width", width).attr("height", height);

	svg.append("g").on("click", click).append("circle").attr("cx", "50").attr("cy", "50").attr("r", "2");

	$("#debug").text("a");
	$("#debug").append("");

	var clouds = new Array();
	for (var i = 0; i < 3; i++)
		clouds[i] = {
			id : i,
			x : 0, //200 * i,
			y : 0, //-76,
			scale : 1
		};

	// prepara la variabile g per l'aggiunta a cascata di attributi
	var g = svg.selectAll("g").data(clouds).enter().append("g");

	g.attr("class", "cloud").attr("id", function(d) {
		return "cloud" + d.id;
	}).attr("transform", transform);

	var path = g.append("path");
	path.attr("d", "m 305.0121,187.44218 c -8.84197,-2.36922 -17.79,0.34211 -23.96728,6.23232 -3.22737,-3.87928 -7.59742,-6.8733 -12.8391,-8.27771 -13.49001,-3.61457 -27.38711,4.40888 -31.00179,17.89893 -0.26561,0.99125 -0.33554,1.98806 -0.47798,2.97948 -12.14842,-1.26284 -23.77254,6.34239 -27.03377,18.51358 -3.23142,12.05984 2.86644,24.3914 13.82638,29.46166 -0.59576,1.2919 -1.15123,2.62282 -1.5318,4.04291 -3.6146,13.49005 4.41688,27.35732 17.90693,30.97189 6.60745,1.7707 13.28483,0.73095 18.82786,-2.35549 3.0549,6.53541 8.75063,11.79543 16.25902,13.80717 10.71286,2.87055 21.5837,-1.67664 27.45263,-10.39216 2.37735,1.68301 5.01988,3.07517 7.99655,3.8729 13.49001,3.61457 27.35724,-4.41703 30.9719,-17.90707 1.81766,-6.78349 0.69295,-13.64829 -2.5882,-19.27444 3.24726,-3.0964 5.78907,-7.01864 7.03448,-11.66659 3.61465,-13.49021 -4.41686,-27.35748 -17.90686,-30.97205 -1.42008,-0.38032 -2.84255,-0.59458 -4.25888,-0.72457 0.83944,-11.84639 -6.77425,-23.02324 -18.67009,-26.21076 z");

	// add event listener on drag event
	var dragBehavior = d3.behavior.drag().on("drag", drag);
	g.call(dragBehavior);

	// add event listener on mouse click event
	//svg.call(d3.behavior.zoom().on("zoom", redraw)).append("g");
	g.on("click", click);

	function click(d) {
		d3.select(this).select("path").style("fill", "red");
		console.log(d3.event.clientX + "," + d3.event.clientY);

		//console.log(d3.mouse(this));
		var factor = 2;

		d.scale = factor * d.scale;
		var centerX = d.x;
		var centerY = d.y;
		d.x = centerX * (factor - 1);
		d.y = centerY * (factor - 1);

		d3.select(this).attr("transform", function(d) {
			return "scale(" + d.scale + ") translate(" + d.x + "," + d.y + ") ";
		});
	}

}

function drag(d, id) {
	d.x += d3.event.dx;
	d.y += d3.event.dy;
	d3.select(this).attr("transform", transform);

	// fix z-index of selected element

	// test se sono vicini
	var gSelection = divSVG.selectAll("g");
	for (var i = 0; i < gSelection.data().length; i++) {

		var dis = distance(d, gSelection.data()[i]);
		var node = divSVG.select("#cloud" + i);
		// se non è l'attuale nodo selezionato
		if (d.id != gSelection.data()[i].id) {

			if (dis < 50)
				node.select("path").attr("class", "near");
			else
				node.select("path").attr("class", "");
		}
	}
}

function transform(d, id) {
	return "translate(" + d.x + "," + d.y + "), scale(" + d.scale + ")";
}

function distance(d1, d2) {
	return Math.sqrt((d1.x - d2.x) * (d1.x - d2.x) + (d1.y - d2.y) * (d1.y - d2.y));
}

/*for (var i = 0; i < 3; i++) {
 clouds[i] = svg.append("g").attr("id", "cloud" + i).attr("class", "cloud");
 clouds[i].attr("transform", "translate(" + (-195 + 340 * i) + "," + -170 + ")");
 clouds[i].append("path").attr("class", "cloud-path").attr("d", "M 410.67959,194.3815 C 392.37515,189.47681 373.85117,195.08975 361.06312,207.28351 C 354.38189,199.25271 345.33513,193.05458 334.48394,190.1472 C 306.55725,182.66441 277.78779,199.27435 270.3048,227.20111 C 269.75493,229.25318 269.61017,231.31674 269.31528,233.36915 C 244.16592,230.75487 220.10196,246.49902 213.35064,271.69554 C 206.66103,296.6615 219.28468,322.19 241.97368,332.68633 C 240.74035,335.36078 239.59041,338.11603 238.80258,341.05587 C 231.31972,368.98263 247.94629,397.69032 275.87305,405.17311 C 289.55164,408.83877 303.37499,406.6863 314.85002,400.29682 C 321.17421,413.82629 332.96537,424.71545 348.50905,428.8801 C 370.68656,434.82265 393.19111,425.40916 405.34082,407.36649 C 410.26235,410.85061 415.73285,413.73264 421.89508,415.3841 C 449.82177,422.86689 478.52936,406.24005 486.01235,378.31329 C 489.77522,364.2703 487.44688,350.05895 480.65432,338.41184 C 487.37673,332.00174 492.63872,323.88203 495.21692,314.25995 C 502.69988,286.33286 486.07327,257.62517 458.14659,250.14238 C 455.20678,249.35502 452.26201,248.91147 449.32995,248.64237 C 451.06775,224.11827 435.30606,200.98024 410.67959,194.3815 z");
 d3.select("#cloud" + i).data([{
 id : i,
 x : -195 + 340 * i,
 y : -170
 }]).call(dragBehavior);
 } */
