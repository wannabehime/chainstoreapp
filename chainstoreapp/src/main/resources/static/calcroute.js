//#TODO: htmlの方の更新を反映させる必要

document.querySelectorAll('.btn').forEach(element => element.addEventListener('click', function(){calcRoute(this)})); //ルート検索ボタンに検索関数を結び付け
function calcRoute(obj) {
	let lat = obj.previousElementSibling.value;
	let lng = obj.previousElementSibling.getAttribute('name');
	let latLng = new google.maps.LatLng(lat, lng);
	//alert(latLng);
	let request = {
		origin: {lat: 35.681236, lng: 139.767125}, 	// #TODO: 現在地と目的地を緯度経度で渡す
		destination: latLng,
		travelMode: 'WALKING'
	};
	new google.maps.DirectionsService().route(request, function(result, status) { //第一引数をリクエストすると返ってくるresultとstatusを第二引数の関数に渡す
		if (status === 'OK') {
			//alert(status);
			directionsRenderer.setDirections(result); //ルートをマップに表示
		} else {
			alert(status);
		}
	});
}