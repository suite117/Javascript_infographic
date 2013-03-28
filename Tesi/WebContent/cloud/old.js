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