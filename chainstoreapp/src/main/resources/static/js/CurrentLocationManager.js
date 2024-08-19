/**
 * 現在地の監視に関するクラス
 */
export class CurrentLocationManager {
    constructor(mapManager) {
        this.mapManager = mapManager; // 地図の操作に関するクラスをインスタンス化
        this.currentLatLng = null; // 現在地の経緯度オブジェクトを格納する変数
        this.currentLocationMarker = null; // 現在地マーカーオブジェクトを格納する変数
        this.currentLocationCircle = null; // 現在地マーカーの周りの円オブジェクトを格納する変数
    }

	/**
	 * 現在地を監視するメソッド
	 */
    watchCurrentLocation() {
        const watchPositionOptions = {
			enableHighAccuracy: true, // 精度（trueだと良い）
			timeout: 5000, // 現在地取得の制限時間
			maximumAge: 0, // キャッシュの位置情報の有効期限。期限内だと新たに取得せずキャッシュから返す
        };
        navigator.geolocation.watchPosition( // 現在地を監視するメソッド。現在地が取得できればsuccessに位置情報、できなければfailにエラーを渡す、optionsは各種設定
            this.watchPositionSuccess.bind(this), // bind:関数内のthisの参照先を切り替える。今回はthis=LocationManagerインスタンスを指定している
            this.watchPositionFail.bind(this),
            watchPositionOptions
        );
    }

	/**
	 * watchPositionの成功時コールバックメソッド
	 */
    watchPositionSuccess(position) {
        this.currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // 現在地のlatlngオブジェクトを更新
        document.getElementById('current-latlng').value = this.currentLatLng; // 店舗検索の中心地として、フォームのhiddenで送る現在地の更新
        document.getElementById('current-location-information-status').style.display = 'none'; //「位置情報を取得中...」の表示を非表示

        if (!this.mapManager.map) {	// マップがまだ存在しない場合は新しく作成
            this.mapManager.initMap(this.currentLatLng);
        }
        this.updateCurrentLocationMarker(); // 現在地マーカーの更新
    }

	/**
	 * watchPositionの失敗時コールバックメソッド
	 */
    watchPositionFail(error) {
        document.getElementById('current-location-information-status').style.display = 'block'; //「位置情報を取得中...」を表示
        if (!this.mapManager.map) {// マップがまだ存在しない場合は新しく作成
            const tokyoStationLatLng = new google.maps.LatLng(35.6812405, 139.7649361); //初期状態を東京駅とする
            this.mapManager.initMap(tokyoStationLatLng);
        }
    }

	/**
	 * 現在地マーカーを更新するメソッド
	 */
    updateCurrentLocationMarker() {
        if (!this.currentLocationMarker) { // マーカーがまだ存在しない場合は新しく作成
            this.createCurrentLocationMarker();
        } else { // マーカーが存在する場合は位置を更新
            this.currentLocationMarker.position = this.currentLatLng;
            this.currentLocationCircle.setCenter(this.currentLatLng);
        }
    }

	/**
	 * 現在地マーカーを新たに作成するメソッド
	 */
    createCurrentLocationMarker() {
        const currentLocationMarkerDiv = document.createElement('div');
        currentLocationMarkerDiv.id = 'current-location-marker';
        this.currentLocationMarker = new google.maps.marker.AdvancedMarkerView({
            map: this.mapManager.map,
            position: this.currentLatLng,
            content: currentLocationMarkerDiv,
        });
        this.currentLocationCircle = new google.maps.Circle({ //現在地マーカーの周りに誤差を表示する円
 			//stroke:ライン
            strokeColor: '#115EC3', //青
            strokeOpacity: 0.2,
            strokeWeight: 1, //幅
            //fill:塗りつぶし
            fillColor: '#115EC3',
            fillOpacity: 0.2,
            map: map,
            center: this.currentLatLng,
            radius: 40
        });
    }
}