var divSVG;
function initClouds(idDOM) {
	divSVG = d3.select(idDOM);

	var svg = divSVG.append("svg").attr("width", 1000).attr("height", 800);

	$("#debug").text("a");
	$("#debug").append("");

	var clouds = new Array();
	for (var i = 0; i < 3; i++)
		clouds[i] = {
			id : i,
			x : 200 * i,
			y : -76,
			scale : 0.5
		};

	// prepara la variabile g per l'aggiunta a cascata di attributi
	var g = svg.selectAll("g").data(clouds).enter().append("g");

	g.attr("class", "cloud").attr("id", function(d) {
		return "cloud" + d.id;
	}).attr("transform", transform);

	var path = g.append("path");
	path.attr("class", "cloud-path").attr("d", "M 410.67959,194.3815 C 392.37515,189.47681 373.85117,195.08975 361.06312,207.28351 C 354.38189,199.25271 345.33513,193.05458 334.48394,190.1472 C 306.55725,182.66441 277.78779,199.27435 270.3048,227.20111 C 269.75493,229.25318 269.61017,231.31674 269.31528,233.36915 C 244.16592,230.75487 220.10196,246.49902 213.35064,271.69554 C 206.66103,296.6615 219.28468,322.19 241.97368,332.68633 C 240.74035,335.36078 239.59041,338.11603 238.80258,341.05587 C 231.31972,368.98263 247.94629,397.69032 275.87305,405.17311 C 289.55164,408.83877 303.37499,406.6863 314.85002,400.29682 C 321.17421,413.82629 332.96537,424.71545 348.50905,428.8801 C 370.68656,434.82265 393.19111,425.40916 405.34082,407.36649 C 410.26235,410.85061 415.73285,413.73264 421.89508,415.3841 C 449.82177,422.86689 478.52936,406.24005 486.01235,378.31329 C 489.77522,364.2703 487.44688,350.05895 480.65432,338.41184 C 487.37673,332.00174 492.63872,323.88203 495.21692,314.25995 C 502.69988,286.33286 486.07327,257.62517 458.14659,250.14238 C 455.20678,249.35502 452.26201,248.91147 449.32995,248.64237 C 451.06775,224.11827 435.30606,200.98024 410.67959,194.3815 z");

	// add event listener on drag event
	var dragBehavior = d3.behavior.drag().on("drag", drag);
	g.call(dragBehavior);

	// add event listener on mouse click event
	g.on("click", function(d) {
		d3.select(this).select("path").style("fill", "red");
	});

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

}

function drag(d, id) {
	d.x += d3.event.dx;
	d.y += d3.event.dy;

	d3.select(this).attr('x', d.x).attr('y', d.y).attr("transform", transform);
	
	// fix z-index of selected element
	d3.select(this).node().parentNode.appendChild(this);
	// test se sono vicini
	var gSelection = divSVG.selectAll("g");
	for (var i = 0; i < gSelection.data().length; i++) {

		var dis = distance(d, gSelection.data()[i]);
		var node = d3.select("#cloud" + i);
		if (d.id != gSelection.data()[i].id && dis < 50)
			node.attr("class", "active");
		else
			node.attr("class", "");
	}
}

function transform(d, id) {
	return "translate(" + d.x + "," + d.y + "), scale(" + d.scale + ")";
}

function distance(d1, d2) {
	return Math.sqrt((d1.x - d2.x) * (d1.x - d2.x) + (d1.y - d2.y) * (d1.y - d2.y));
}