function initMap() {
	let directionsRenderer = new google.maps.DirectionsRenderer();
	// #TODO: 現在地を取得して代入する
	let tokyoStation = new google.maps.LatLng(35.681236, 139.767125);
	let mapOptions = {
		center: tokyoStation,
		zoom: 15
	};
	let map = new google.maps.Map(document.getElementById('map'), mapOptions);
	directionsRenderer.setMap(map);
}