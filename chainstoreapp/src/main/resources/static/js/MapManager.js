export class MapManager {
    constructor() {
        this.map = null; // マップオブジェクトを格納する
        this.directionsRenderer = new google.maps.DirectionsRenderer(); //ルートをレンダリングするためのオブジェクトを生成
        this.bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域オブジェクトを格納
    }
    
    initMap(latLng) {
        const mapOptions = {
            zoom: 18,
            center: latLng,
            mapId: "574de86c3981bebd"
        };
        this.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    }

    setCenter(latLng) {
        this.map.setCenter(latLng);
    }

    fitBounds() {
        this.map.fitBounds(this.bounds);
    }

    addToBounds(latLng) {
        this.bounds.extend(latLng);
    }

    clearDirections() {
        this.directionsRenderer.setMap(null);
    }

    setDirections(result) {
        this.directionsRenderer.setMap(this.map);
        this.directionsRenderer.setDirections(result);
    }
}