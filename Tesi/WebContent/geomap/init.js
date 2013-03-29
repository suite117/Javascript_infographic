function init(destinationDiv, idMap, data) {

	var layers = new Array();
	var center = [53.73, -0.30];

	$("#" + destinationDiv).append('<div id="' + idMap + '" style="width: 600px; height: 400px"></div>"');
	var map = new L.map(idMap);
	//var center = new L.LatLng(latitute, longitude);
	// set up the map

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	var osmAttrib = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors';
	L.tileLayer(osmUrl, {
		minZoom : 8,
		maxZoom : 18,
		attribution : osmAttrib
	}).addTo(map);

	// add and open popup
	L.marker(center).addTo(map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

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
		if (map.getZoom() != null)
			return map.getZoom() * 30;
		else
			return map.getMinZoom() * 30;
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

	map.on('zoomend', function(e) {

		var bounds = e.target.getBounds();
		var minll = bounds.getSouthWest();
		var maxll = bounds.getNorthEast();

		e.target.removeLayer(pie);
		pie.options.radius = (pie.options.radius / distance) * (maxll.lat - minll.lat);
		distance = maxll.lat - minll.lat;

		e.target.addLayer(pie);
	});

	//this sets up an icon to be replaced when redraw.
	var LeafIcon = L.Icon.extend({
		options : {
			iconUrl : 'images/marker-icon.png',
			shadowUrl : 'images/marker-shadow.png'
		}
	});

	var LeafIconActive = L.Icon.extend({
		options : {
			iconUrl : 'images/marker-icon-active.png',
			shadowUrl : 'images/marker-shadow.png'
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
		var content = "<p>" + e.target.data.name + "</p>";
		// + e.target.data.artist;
		e.target.bindPopup(content).openPopup();
	}

	function askForMarkers() {

		//	$.getJSON('data.json', function(data) {

		for ( i = 0; i < data.length; i++) {
			var marker = new L.Marker(new L.LatLng(data[i].lat, data[i].lon, true));
			marker.data = data[i];
			marker.on('click', onMarkerClick);

			marker.data.active = false;
			var icon = new LeafIcon();
			marker.setIcon(icon);

			map.addLayer(marker);
		}
		//	});
	}

	
	askForMarkers();
	map.setView(center, startZoom);
}

