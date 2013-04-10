function GeoMap(divId, destinationDivId, idMap, data) {

	this.divId = divId;
	this.destinationDivId = destinationDivId;
	this.data = data;

	var layers = [];
	var center = [53.73, -0.30];

	$("#" + this.destinationDivId).append('<div id="' + idMap + '" style="width:100%;height: 100%"></div>');
	this.map = new L.map(idMap);

	//var center = new L.LatLng(latitute, longitude);
	// set up the map

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	L.tileLayer(osmUrl, {
		minZoom : 1,
		maxZoom : 18,
		attribution : osmAttrib
	}).addTo(this.map);

	// add and open popup
	L.marker(center).addTo(this.map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	var list = [{
		num : 75,
		label : 'Bob'
	}, {
		num : 60,
		label : 'Tom'
	}, {
		num : 45,
		label : 'Ada'
	}];

	function calculateRadius() {

		//alert(map.getMinZoom());
		if (this.map.getZoom() != null)
			return this.map.getZoom() * 30;
		else
			return this.map.getMinZoom() * 30;
	}

	// Pie chart
	var pie = L.pie(center, list, {
		radius : 200
	}, {
		pathOptions : {
			opacity : 0.9,
			fillOpacity : 0.9
		}
	});

	var startZoom = 11;
	var distance = 0.2 / startZoom;

	this.map.on('zoomend', function(e) {

		var bounds = e.target.getBounds();
		var minll = bounds.getSouthWest();
		var maxll = bounds.getNorthEast();

		e.target.removeLayer(pie);
		pie.options.radius = (pie.options.radius / distance) * (maxll.lat - minll.lat);
		distance = maxll.lat - minll.lat;

		e.target.addLayer(pie);
	});

	this.draw(this.data);
	this.map.setView(center, startZoom);
}

GeoMap.prototype.draw = function(data) {

	this.data = data;

	for (var marker in this.markers)
	this.map.removeLayer(marker);

	this.markers = [];
	for (var i = 0; i < data.length; i++) {

		var element = data[i];

		var marker = new L.Marker(new L.LatLng(element.lat, element.lon));
		marker.data = element;
		marker.on('click', onMarkerClick);

		var icon = new LeafIcon();
		if (marker.data.selected) {
			var icon = new LeafIconActive();
		}

		marker.setIcon(icon);

		this.markers[marker.data.id] = marker;
		this.map.addLayer(marker);
	}

	var divId = this.divId;
	var data = this.data;

	function onMarkerClick(e) {

		var icon;
		//var element = data.find(e.target.data.id);
		if (e.target.data.selected) {
			icon = new LeafIcon();
			e.target.data.selected = false;

		} else {
			icon = new LeafIconActive();
			e.target.data.selected = true;

		}
		e.target.setIcon(icon);

		var popup = L.popup();
		var content = "<p>" + e.target.data.id + " " + e.target.data.name + "</p>";
		e.target.bindPopup(content).openPopup();

		$("#" + divId).trigger("dataChanged");
	}

};

GeoMap.prototype.getSelected = function() {
	var selected = [];

	for (var i = 0; i < this.data.length; i++) {
		var element = this.data[i];
		if (element.selected)
			selected.push(element);
	}

	return selected;
}

GeoMap.prototype.remove = function(id) {
	this.map.removeLayer(this.markers[id]);
}

GeoMap.prototype.add = function(id) {
	this.map.addLayer(this.markers[id]);
}
//this sets up an icon to be replaced when redraw.
var LeafIcon = L.Icon.extend({
	options : {
		iconUrl : baseUrl + '/geomap/images/marker-icon.png',
		shadowUrl : baseUrl + '/geomap/images/marker-shadow.png'
	}
});

var LeafIconActive = L.Icon.extend({
	options : {
		iconUrl : baseUrl + '/geomap/images/marker-icon-active.png',
		shadowUrl : baseUrl + '/geomap/images/marker-shadow.png'
	}
});

