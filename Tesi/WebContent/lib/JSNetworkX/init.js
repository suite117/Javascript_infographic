
function init() {

	var G2 = jsnx.DiGraph();
	G2.add_nodes_from([ 1, 2, 3, 4, 5, [ 9, {
		color : '#008A00'
	} ] ]);

	// aggiunge un ciclo tra questi nodi
	G2.add_cycle([ 1, 2, 3, 4, 5 ]);
	// aggiunge dei link tra i nodi
	G2.add_edges_from([ [ 1, 9 ], [ 9, 1 ] ]);
	jsnx.draw(G2, {
		element : '#chart2',
		with_labels : true,
		// inizializzazione grafo
		layout_attr : {
			// 'charge' : -120,
			'linkDistance' : 100,

		},
		node_shape : "circle",
		node_style : {

			fill : function(d) {
				return d.data.color;
			},

		},
		label_style : {
			fill : 'white',
		},
		// default element is circle, so the element will have a radius of 10
		'node_attr' : {
			'r' : 40
		},
	/*
	 * 'node_style': { 'stroke': '#333', 'fill': '#999', 'cursor': 'pointer' }
	 */

	}, true);

	d3.selectAll('svg').style('opacity', 0.01).transition().duration(1500)
			.style('opacity', 1);
}