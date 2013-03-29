function jsonToTreeJson(oldTree) {
	var root = new Object();
	root.id = oldTree[0].id;
	root.name = oldTree[0].name;
	oldTree.splice(0, 1);
	findChildren(root, oldTree);
	console.log(root);
}

function findChildren(node, list) {
	node.children = new Array();
	for (var i = 0; i < list.length; i++) {
		if (list[i].parentId == node.id) {
			var child = new Object();
			child.id = list[i].id;
			child.name = list[i].name;
			list.splice(i, 1);
			node.children.push(child);
			findChildren(child, list);

		}
	}
}
