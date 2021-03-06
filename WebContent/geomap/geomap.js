/**
 * This is the description for my class.
 * 
 * @class GeoMap
 * @constructor
 * @param {String}
 *            destinationDivId id dell'elemento DOM destinazione a cui sarà
 *            appesa la mappa
 * @param {String}
 *            idMap id dell'elemento DOM mappa
 * 
 */
function GeoMap(destinationDivId, data, idField, optional) {

	this.destinationDivId = destinationDivId;
	idMap = destinationDivId + "-geomap";
	this.data = data;
	this.selected = [];

	this.center = [ 0, 0 ];
	this.idField = idField;
	this.nameField = "name";
	if (optional != null) {
		this.center = optional.center ? optional.center : this.center;
		this.nameField = optional.name ? optional.name : this.nameField;
	}

	$("#" + this.destinationDivId).append(
			'<div id="' + idMap + '" style="width:100%;height: 100%"></div>');
	this.map = new L.map(idMap);

	// set up the map

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	L.tileLayer(osmUrl, {
		minZoom : 1,
		maxZoom : 18,
		attribution : osmAttrib
	}).addTo(this.map);

	// add and open popup
	// L.marker(this.center).addTo(this.map).bindPopup("<b>Hello world!</b><br
	// />I am a popup.").openPopup();

	var list = [ {
		num : 75,
		label : 'Bob'
	}, {
		num : 60,
		label : 'Tom'
	}, {
		num : 45,
		label : 'Ada'
	} ];

	function calculateRadius() {

		// alert(map.getMinZoom());
		if (this.map.getZoom() != null)
			return this.map.getZoom() * 30;
		else
			return this.map.getMinZoom() * 30;
	}

	// Pie chart
	var pieCoord = [ this.data[0] ? this.data[0].lat : 0,
			this.data[0] ? this.data[0].lon : 0 ];
	var pie = L.pie(pieCoord, list, {
		radius : 200
	}, {
		pathOptions : {
			opacity : 0.9,
			fillOpacity : 0.9
		}
	});

	var startZoom = 6;
	var distance = 0.2 / startZoom;

	this.map.on('zoomend', function(e) {

		var bounds = e.target.getBounds();
		var minll = bounds.getSouthWest();
		var maxll = bounds.getNorthEast();

		e.target.removeLayer(pie);
		pie.options.radius = (pie.options.radius / distance)
				* (maxll.lat - minll.lat);
		distance = maxll.lat - minll.lat;
		e.target.addLayer(pie);
	});

	// console.log("data.length", data.length);

	this.map.setView(this.center, startZoom);

	if (data != null && data.length != 0)
		this.draw(this.data);
}

GeoMap.prototype.draw = function(data, selected) {

	this.data = data;
	// console.log("data", data);
	this.selected = selected ? selected : this.selected;

	this.center = data[0] ? [ data[0].lat, data[0].lon ] : this.center;
	this.map.setView(this.center, this.map.getZoom());

	if (this.markers != null)
		for ( var i = 0; i < this.markers.length; i++) {
			this.map.removeLayer(this.markers[i]);
		}

	this.markers = [];
	for ( var i = 0; i < data.length; i++) {

		var element = data[i];

		var marker = new L.Marker(new L.LatLng(element.lat, element.lon),
				options = {
					"title" : "t" + data[i][this.idField]
				});
		marker.data = element;
		marker.on('click', onMarkerClick);

		var icon = new LeafIcon();

		for ( var j = 0; j < this.selected.length; j++) {
			if (marker.data[this.idField] == selected[j]) {
				icon = new LeafIconActive();
				break;
			}
		}

		marker.setIcon(icon);

		this.markers.push(marker);
		this.map.addLayer(marker);
	}

	var idField = this.idField;
	var nameField = this.nameField;
	var destinationDivId = this.destinationDivId;
	function onMarkerClick(e) {

		var icon;
		// var element = data.find(e.target.data.id);
		if (e.target.data.selected) {
			icon = new LeafIcon();
			e.target.data.selected = false;

		} else {
			icon = new LeafIconActive();
			e.target.data.selected = true;

		}
		e.target.setIcon(icon);

		var popup = L.popup();
		// console.log("e.target.data", e.target.data);
		var content = "<p>" + e.target.data[nameField] + "</p>";
		e.target.bindPopup(content).openPopup();

		$("#" + destinationDivId).trigger("mapClicked",
				[ e.target.data[idField], e.target.data.selected ]);
	}

};

GeoMap.prototype.getSelected = function() {
	var selected = [];

	for ( var i = 0; i < this.data.length; i++) {
		var element = this.data[i];
		if (element.selected)
			selected.push(parseInt(element[this.idField]));
	}

	return selected;
};

GeoMap.prototype.remove = function(id) {
	this.map.removeLayer(this.markers[id]);
};

GeoMap.prototype.add = function(id) {
	this.map.addLayer(this.markers[id]);
};
// this sets up an icon to be replaced when redraw.
var LeafIcon = L.Icon.extend({
	options : {
		iconUrl : baseUrl + '/geomap/images/marker-icon.png',
		shadowUrl : baseUrl + '/geomap/images/marker-shadow.png',
		className : 'leaflet-icon'
	}
});

var LeafIconActive = L.Icon.extend({
	options : {
		iconUrl : baseUrl + '/geomap/images/marker-icon-active.png',
		shadowUrl : baseUrl + '/geomap/images/marker-shadow.png',
		className : 'leaflet-icon-active'
	}
});
