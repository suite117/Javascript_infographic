function Tree(destinationDivId, idField, data) {
	
	var idMap = destinationDivId + '-tree';
	this.nodes = new Array();
	this.root = jsonToTreeJson(data);
	var width= 800;
	var height = 600;
	var m = [20, 20, 20, 20];
	var w = width - m[1] - m[3];
	var h = height - m[0] - m[2];

	this.root.x0 = h / 2;
	this.root.y0 = 0;

	var i = 0;

	var tree = d3.layout.tree().size([h, w]);

	var diagonal = d3.svg.diagonal().projection(function(d) {
		return [d.y, d.x];
	});

	var x = d3.scale.linear().domain([0, w]).range([0, w]);
	var y = d3.scale.linear().domain([0, h]).range([0, h]);

	// parametro viewBox
	// minx—the beginning x coordinate
	// miny—the beginning y coordinate
	// width—width of the view box
	// height—height of the view box
	// <svg width="800" height="400" viewBox="0 0 800 400">
	var minx = 0;
	var miny = 0;

	var vis = d3.select("#" + destinationDivId).append("svg:svg").attr("id", idMap).attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).attr("viewBox", minx + " " + miny + " " + (width - 200) + " " + height);
	vis.append("svg:g").attr("transform", "translate(" + m[3] + "," + m[0] + ")");
	// .attr("pointer-events", // "all")
	// .call(d3.behavior.zoom().scaleExtent([1,8]).on("zoom",zoom));
	vis.call(d3.behavior.zoom().x(x).y(y).scaleExtent([1, 8]).on("zoom", zoom));

	// vis.on("mouseup", function() { alert("dragging: "); });

	vis.append("rect").attr("class", "overlay").attr("width", w + m[1] + m[3]).attr("height", h + m[0] + m[2]).attr("opacity", 0);

	function toggleAll(d) {
		if (d.children) {
			d.children.forEach(toggleAll);
			toggle(d);
			//this.nodes[d.id] = d;
		}
	}

	

	// initialize the display to show a few nodes.
	this.root.children.forEach(toggleAll);
	// toggle(root.children[1]);
	// toggle(root.children[9]);

	update(this.root, this.root, this.nodes);
	console.log(this.nodes);
	
	function update(source, root, nodeshash) {
		var duration = d3.event && d3.event.altKey ? 5000 : 500;

		// Compute the new tree layout.
		var nodes = tree.nodes(root).reverse();
		
		// Normalize for fixed-depth.
		nodes.forEach(function(d) {
			d.y = d.depth * 180;
			nodeshash[d.id] = d;
		});

		// Update the nodes...
		var node = vis.selectAll("g.node").data(nodes, function(d) {
			return d.id || (d.id = ++i);
		});

		// Enter any new nodes at the parent's previous position.
		var nodeEnter = node.enter().append("svg:g").attr("class", "node").attr("transform", function(d) {
			return "translate(" + source.y0 + "," + source.x0 + ")";
		}).on("click", function(d) {
			toggle(d);
			update(d, root, nodes);
			//utile per i popup
			if (d['info']) {
				playvid(d['info']);
			}
		});

		nodeEnter.append("svg:circle").attr("r", 1e-6).style("fill", function(d) {
			return d._children ? "lightsteelblue" : "#fff";
		}).style("visibility", "visible");

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
		var nodeUpdate = node.transition().duration(duration).attr("transform", function(d) {
			return "translate(" + d.y + "," + d.x + ")";
		});

		nodeUpdate.select("circle").attr("class", "node123").attr("r", 4.5).style("fill", function(d) {
			return d._children ? "lightsteelblue" : "#fff";
		});

		nodeUpdate.select("text").style("fill-opacity", 1);

		// Transition exiting ndoes to the parent's new position.
		
		var nodeExit = node.exit().transition().duration(duration).attr("transform", function(d) {
			return "translate(" + source.y + "," + source.x + ")";
		}).remove();
		

		nodeExit.select("circle").attr("r", 1e-6);
		nodeExit.select("text").style("fill-opacity", 1e-6);
		
		
		// Update the links...
		var link = vis.selectAll("path.link").data(tree.links(nodes), function(d) {
			return d.target.id;
		});

		// Enter any new links at hte parent's previous position
		link.enter().insert("svg:path", "g").attr("class", "link").attr("d", function(d) {
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
		var result = "M" + sourceX + "," + sourceY + " C" + targetX + "," + sourceY + " " + targetY + "," + y(d.target.x0) + " " + targetX + "," + linkTargetY + "";
		// console.log(result);

		return result;
	}

}
//wrapper che rende il json estratto dal database compatibile con le funzioni di visualizzazione dell' albero
function jsonToTreeJson(oldTree) {
	var root = new Object();
	root.id = 1;
	root.name = oldTree[0].name;
	findChildren(root, oldTree);
	return root;
}

function findChildren(node, list) {
	node.children = new Array();
	//i = 1 in quanto deve essere escluso il nodo root che non ha parentId
	for (var i = 1; i < list.length; i++) {
		if (list[i].parentId == node.id - 1) {
			var child = new Object();
			child.id = list[i].id + 1;
			child.name = list[i].name;
			node.children.push(child);
			findChildren(child, list);

		}
	}
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

Tree.prototype.add = function (id) {
  toggle(this.nodes[id]);
};

