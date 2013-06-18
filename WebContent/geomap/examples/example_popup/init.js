function initmap() {
	var hull = new L.LatLng(38.129155, 13.360634);
	var map = L.map('map').setView(hull, 13);

	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
	L.tileLayer(osmUrl, {
		minZoom : 8,
		maxZoom : 18,
		attribution : 'Map data © openstreetmap contributors'
	}).addTo(map);

	L.marker([38.129155, 13.360634]).addTo(map).bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	L.circle([51.508, -0.11], 500, {
		color : 'red',
		fillColor : '#f03',
		fillOpacity : 0.5
	}).addTo(map).bindPopup("I am a circle.");

	L.polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]]).addTo(map).bindPopup("I am a polygon.");

	var popup = L.popup();

	function onMapClick(e) {
		popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString()).openOn(map);
	}


	map.on('click', onMapClick);

} 