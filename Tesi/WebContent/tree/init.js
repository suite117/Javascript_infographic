function GraphTree(root, div_destination) {

	var width = 800;
	var height = 600;
	var m = [ 20, 20, 20, 20 ];
	var w = width - m[1] - m[3];
	var h = height - m[0] - m[2];

	root.x0 = h / 2;
	root.y0 = 0;

	var i = 0;

	var tree = d3.layout.tree().size([ h, w ]);

	var diagonal = d3.svg.diagonal().projection(function(d) {
		return [ d.y, d.x ];
	});

	var x = d3.scale.linear().domain([ 0, w ]).range([ 0, w ]);
	var y = d3.scale.linear().domain([ 0, h ]).range([ 0, h ]);

	// parametro viewBox
	// minx—the beginning x coordinate
	// miny—the beginning y coordinate
	// width—width of the view box
	// height—height of the view box
	// <svg width="800" height="400" viewBox="0 0 800 400">
	var minx = 0;
	var miny = 0;

	var vis = d3.select(div_destination).append("svg:svg").attr("width",
			w + m[1] + m[3]).attr("height", h + m[0] + m[2]).attr("viewBox",
			minx + " " + miny + " " + (width - 200) + " " + height);
	vis.append("svg:g").attr("transform",
			"translate(" + m[3] + "," + m[0] + ")");
	// .attr("pointer-events", // "all")
	// .call(d3.behavior.zoom().scaleExtent([1,8]).on("zoom",zoom));
	vis.call(d3.behavior.zoom().x(x).y(y).scaleExtent([ 1, 8 ])
			.on("zoom", zoom));

	// vis.on("mouseup", function() { alert("dragging: "); });

	vis.append("rect").attr("class", "overlay").attr("width", w + m[1] + m[3])
			.attr("height", h + m[0] + m[2]).attr("opacity", 0);

	function toggleAll(d) {
		if (d.children) {
			d.children.forEach(toggleAll);
			toggle(d);
		}
	}
	;

	// initialize the display to show a few nodes.
	root.children.forEach(toggleAll);
	// toggle(root.children[1]);
	// toggle(root.children[9]);

	update(root);

	function update(source) {
		var duration = d3.event && d3.event.altKey ? 5000 : 500;

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse();

		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			d.y = d.depth * 180;
		});

		// Update the nodes...
		var node = vis.selectAll("g.node").data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("svg:g").attr("class", "node")
				.attr("transform", function(d) {
					return "translate(" + source.y0 + "," + source.x0 + ")";
				}).on("click", function(d) {
					toggle(d);
					update(d);
					if (d['info']) {
						playvid(d['info']);
					}
				});

		nodeEnter.append("svg:circle").attr("r", 1e-6).style("fill",
				function(d) {
					return d._children ? "lightsteelblue" : "#fff";
				});

		nodeEnter.append("svg:text")
		// .attr("y", function(d) { return d.children || d._children ? -10 : 10;
		// })
		// .attr("dx", ".35em")
		.attr("x", function(d) {
			return d.children || d._children ? -10 : 10;
		}).attr("dy", ".35em").attr("text-anchor", function(d) {
			return d.children || d._children ? "end" : "start";
		}).text(function(d) {
			return d.name;
		}).style("fill-opacity", 1e-6);

		// Transition nodes to their new position.
		var nodeUpdate = node.transition().duration(duration).attr("transform",
				function(d) {
					return "translate(" + d.y + "," + d.x + ")";
				});

		nodeUpdate.select("circle").attr("class", "node123").attr("r", 4.5).style("fill", function(d) {
			return d._children ? "lightsteelblue" : "#fff";
		});

		nodeUpdate.select("text").style("fill-opacity", 1);

		// Transition exiting ndoes to the parent's new position.
		var nodeExit = node.exit().transition().duration(duration).attr(
				"transform", function(d) {
					return "translate(" + source.y + "," + source.x + ")";
				}).remove();

		nodeExit.select("circle").attr("r", 1e-6);
		nodeExit.select("text").style("fill-opacity", 1e-6);

		// Update the links...
		var link = vis.selectAll("path.link").data(tree.links(nodes),
				function(d) {
					return d.target.id;
				});

		// Enter any new links at hte parent's previous position
		link.enter().insert("svg:path", "g").attr("class", "link").attr("d",
				function(d) {
					var o = {
						x : source.x0,
						y : source.y0
					};
					return diagonal({
						source : o,
						target : o
					});
				}).transition().duration(duration).attr("d", diagonal);

		// Transition links to their new position.
		link.transition().duration(duration).attr("d", diagonal);

		// Transition exiting nodes to the parent's new position.
		link.exit().transition().duration(duration).attr("d", function(d) {
			var o = {
				x : source.x,
				y : source.y
			};
			return diagonal({
				source : o,
				target : o
			});
		}).remove();

		// Stash the old positions for transition.
		nodes.forEach(function(d) {
			d.x0 = d.x;
			d.y0 = d.y;
		});
	}
	// Toggle children
	function toggle(d) {
		if (d.children) {
			d._children = d.children;
			d.children = null;
		} else {
			d.children = d._children;
			d._children = null;
		}
	}

	// zoom in / out
	function zoom(d) {
		// vis.attr("transform", "translate(" + d3.event.translate + ")scale(" +
		// d3.event.scale + ")");
		var nodes = vis.selectAll("g.node");
		nodes.attr("transform", transform);

		// Update the links...
		var link = vis.selectAll("path.link");
		link.attr("d", translate);

		// Enter any new links at hte parent's previous position
		// link.attr("d", function(d) {
		// var o = {x: d.x0, y: d.y0};
		// return diagonal({source: o, target: o});
		// });
	}

	function clickWhite() {
		var nodes = vis.selectAll("g.node");
		nodes.attr("transform", transform);

		// Update the links...
		var link = vis.selectAll("path.link");
		link.attr("d", translate);
	}

	function transform(d) {
		return "translate(" + x(d.y) + "," + y(d.x) + ")";
	}

	function translate(d) {
		var sourceX = x(d.target.parent.y);
		var sourceY = y(d.target.parent.x);
		var targetX = x(d.target.y);
		var targetY = (sourceX + targetX) / 2;
		var linkTargetY = y(d.target.x0);
		var result = "M" + sourceX + "," + sourceY + " C" + targetX + ","
				+ sourceY + " " + targetY + "," + y(d.target.x0) + " "
				+ targetX + "," + linkTargetY + "";
		// console.log(result);

		return result;
	}

}
