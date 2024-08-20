/**
 * マップ操作に関するクラス
 */
export class MapManager {
    constructor() {
        this.map = null; // マップオブジェクトを格納する
        this.directionsRenderer = new google.maps.DirectionsRenderer(); //ルートをレンダリングするためのオブジェクトを生成
        this.bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域オブジェクトを格納
    }
    
    /**
	 * マップを初期化するメソッド
	 */
    initMap(latlng) {
        const mapOptions = {
            zoom: 18,
            center: latlng,
            mapId: "574de86c3981bebd"
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

	/**
	 * マップに表示する矩形領域に経緯度を格納するメソッド
	 */
    addToBounds(latlng) {
        this.bounds.extend(latlng);
    }
    
    /**
	 * 矩形領域を表示するようにマップを調整するメソッド
	 */
    fitBounds() {
        this.map.fitBounds(this.bounds);
    }

	/**
	 * ルート案内を表示するメソッド
	 */
    setDirections(result) {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);
    }
    
	/**
	 * ルート案内を消去するメソッド 
	 */
    clearDirections() {
        this.directionsRenderer.setMap(null);
    }
}