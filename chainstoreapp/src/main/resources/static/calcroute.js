function calcRoute() {
	let directionsService = new google.maps.DirectionsService();
	let directionsRenderer = new google.maps.DirectionsRenderer();
	// #TODO: 現在地と目的地を緯度経度で渡す
	let request = {
		origin: {lat: 35.681236, lng: 139.767125},
		destination: {query: '秋葉原駅'},
		travelMode: 'WALKING'
	};
	directionsService.route(request, function(result, status) {
		if (status === 'OK') {
			directionsRenderer.setDirections(result);
		} else {
			alert('Directions request failed due to ' + status);
		}
	});
}