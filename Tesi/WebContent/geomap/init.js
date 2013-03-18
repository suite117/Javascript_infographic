function initmap() {

	var latitute = 38.129155;
	var longitude = 13.360634;
	var center = [38.129155, 13.360634];

	//var center = new L.LatLng(latitute, longitude);
	var map = L.map('map').setView(center, 13);

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	L.tileLayer(osmUrl, {
		minZoom : 8,
		maxZoom : 18,
		attribution : 'Map data © openstreetmap contributors'
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

	var popup = L.popup();
	function onMapClick(e) {
		popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
	}


	map.on('click', onMapClick);

} 