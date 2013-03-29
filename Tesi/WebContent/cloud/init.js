$(document).ready(function() {

	var dominio = [];

	createContainer();
	createContainer();
	createContainer();

	var persone = (function() {
		var json = null;
		$.ajax({
			'async' : false,
			'global' : false,
			'url' : "persone.json",
			'dataType' : "json",
			'success' : function(data) {
				json = data;
			}
		});
		return json;
	})();

	dominio.push({
		elements : persone
	});

	var armi = (function() {
		var json = null;
		$.ajax({
			'async' : false,
			'global' : false,
			'url' : "armi.json",
			'dataType' : "json",
			'success' : function(data) {
				json = data;
			}
		});
		return json;
	})();

	dominio.push({
		elements : armi
	});
	initClouds('#viz', dominio);

}); 