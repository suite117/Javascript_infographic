var map;
function initmap() {

	var layers = new Array();

	var latitute = 38.129155;
	var longitude = 13.360634;
	var center = [53.775, -0.356];

	map = new L.map('map');
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
		num : 45,
		label : 'Bob'
	}, {
		num : 60,
		label : 'Tom'
	}, {
		num : 45,
		label : 'Ada'
	}];

	// Pie chart
	L.pie(center, list, {
		pathOptions : {
			opacity : 0.9,
			fillOpacity : 0.9
		}
	}).addTo(map);

	//map.on('click', onMarkerClick);

	askForMarkers();
	map.setView(center, 13);
}

function onMarkerClick2(e) {
	popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
}

function onMarkerClick(e) {
	var popup = L.popup();

	// popup coordinates adjust
	popup.setLatLng(new L.LatLng(parseFloat(e.target.data.lat) + 0.003, e.target.data.lon)).openOn(map);
	
	var content = e.target.data.name + " " + e.target.data.artist
	popup.setContent(content);
	//toadname.innerHTML = e.target.data.name;
	//artist.innerHTML = e.target.data.artist;
}

function markerClick(e) {
	// if a marker is clicked, display the details from it
	var toadname = document.getElementById('toadname');
	var artist = document.getElementById('artist');
	var sponsor = document.getElementById('sponsor');
	var designer = document.getElementById('designer');
	var toadpic = document.getElementById('toadpic');
	var toadpiclink = document.getElementById('toadpiclink');
	toadname.innerHTML = e.target.data.name;
	artist.innerHTML = e.target.data.artist;
	sponsor.innerHTML = e.target.data.sponsor;
	designer.innerHTML = e.target.data.designer;
	toadpic.src = 'toadpics/thumbs/' + e.target.data.pic;
	toadpiclink.href = 'toadpics/' + e.target.data.pic;
}

function askForMarkers() {
	$.getJSON('data.json', function(data) {

		for ( i = 0; i < data.length; i++) {
			var marker = new L.Marker(new L.LatLng(data[i].lat, data[i].lon, true));
			marker.data = data[i];
			marker.on('click', onMarkerClick);
			map.addLayer(marker);
			//layers.push(marker);
		}
	});
}
