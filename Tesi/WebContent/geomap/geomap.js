function GeoMap(destinationDivId, idMap, data) {
	this.destinationDivId = destinationDivId;
	this.data = data;

	var layers = new Array();
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

	this.askForMarkers();
	this.map.setView(center, startZoom);
}

GeoMap.prototype.askForMarkers = function() {

	this.markers = new Array();
	for ( i = 0; i < this.data.length; i++) {
		var marker = new L.Marker(new L.LatLng(this.data[i].lat, this.data[i].lon));
		marker.data = this.data[i];
		marker.on('click', onMarkerClick);

		marker.data.active = false;
		var icon = new LeafIcon();
		marker.setIcon(icon);

		this.markers[marker.data.id] = marker;
		this.map.addLayer(marker);
	}

};

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

function onMarkerClick(e) {

	var icon;
	if (e.target.active) {
		icon = new LeafIcon();
		e.target.active = false;
	} else {
		icon = new LeafIconActive();
		e.target.active = true;
	}
	e.target.setIcon(icon);

	var popup = L.popup();
	var content = "<p>" + e.target.data.id + " " + e.target.data.name + "</p>";
	// + e.target.data.artist;
	e.target.bindPopup(content).openPopup();
}

