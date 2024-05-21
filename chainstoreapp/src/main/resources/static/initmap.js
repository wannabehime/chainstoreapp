//#TODO: htmlの方の更新を反映させる必要

var directionsRenderer;
let nowLatLng;

function initMap() {
	let map;
	
	function success(position) {
		let coords = position.coords;
		nowLatLng = new google.maps.LatLng(coords.latitude, coords.longitude);
		let mapOptions = {
			zoom: 15,
			center: nowLatLng,
			mapId: "574de86c3981bebd"
		};
		
		map = new google.maps.Map(document.getElementById('map'), mapOptions); //マップの作成
		let marker = new google.maps.marker.AdvancedMarkerElement({
			position: nowLatLng, //マーカーの位置（必須）
			map: map //マーカーを表示する地図
		});
		directionsRenderer = new google.maps.DirectionsRenderer();
		directionsRenderer.setMap(map); //レンダラにマップを関連付け
	}
	
	function fail(error) {
		alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
		let latLng = new google.maps.LatLng(35.6812405, 139.7649361); //東京駅
		let mapOptions = {
			zoom: 15,
			center: latLng,
			mapId: "574de86c3981bebd"
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions);
		
		directionsRenderer = new google.maps.DirectionsRenderer();
		directionsRenderer.setMap(map); //レンダラにマップを関連付け
	}
	
	const options = {
	  enableHighAccuracy: true, //精度（trueだと良い）
	  timeout: 5000, //制限時間
	  maximumAge: 0, //キャッシュの位置情報の有効期限。期限内だと新たに取得せずキャッシュから返す
	};
	
	navigator.geolocation.getCurrentPosition(success, fail, options); //現在地が取得できればsuccessに位置情報、できなければfail関数にエラー、optionsは各種設定
	
}