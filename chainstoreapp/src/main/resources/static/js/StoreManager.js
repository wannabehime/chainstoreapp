import { NoticeManager } from './NoticeManager.js';

/**
 * 店舗検索とルート検索に関するクラス
 */
export class StoreManager {
    constructor(mapManager, locationManager, menuManager) {
        this.mapManager = mapManager;
        this.locationManager = locationManager;
        this.menuManager = menuManager;
        this.storeMarkers = []; // 店舗マーカーを格納する配列
    }

	/**
	 * 店舗検索を行うメソッド
	 */
    searchStores(formData) {
        const request = new URLSearchParams(formData).toString(); // URLSearchParams:クエリ文字列を生成
        fetch(`/chainstoresearch/search-stores?${request}`)
            .then(response => { // fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
                if (!response.ok) {
                    throw new Error(); // Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
                }
                return response.json(); // アロー関数の略記ではreturnしないと次のthenに値を渡せない
            })
            .then(stores => { // json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
                if (!stores.length) { // 該当する店舗がなければメッセージを表示
                    NoticeManager.createNoStoreNotice();
                } else {
                    this.searchStoresSuccess(stores);
                }
            })
            .catch(error => { // ルート検索に失敗したら、失敗のメッセージ表示
                NoticeManager.createFailGetInformationNotice();
            });
    }

	/**
	 * 店舗検索に成功した場合の、マーカー・情報ウィンドウ・メニューコンテナを表示するメソッド
	 */
    searchStoresSuccess(stores) {
        this.initMarkersAndButton(); // マーカーとボタンの初期化
        
 		stores.forEach(store => {
			const marker = this.setMarker(store); // マーカーの生成
			this.setInfoWindow(store, marker); // 情報ウィンドウの生成
		});
		
        if (this.locationManager.currentLatLng) {
            this.mapManager.addToBounds(this.locationManager.currentLatLng); //現在地が取得できていれば矩形領域に追加
        }
        this.mapManager.fitBounds(); //マップに矩形領域を伝える
        
        this.menuManager.displayMenuResultsContainer(); //メニューコンテナを表示
    }

	/**
	 * マーカーとボタンを初期化するメソッド
	 */
    initMarkersAndButton() {
        this.mapManager.clearDirections(); // ルート案内を消すためにレンダラとマップの関連を削除
        this.storeMarkers.forEach(storeMarker => {
            storeMarker.map = null; // 各店舗のマーカーを削除
        });
        this.storeMarkers = []; // マーカーリストを初期化
        this.mapManager.bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域のインスタンスを生成
        document.getElementById('return-to-stores-list-button').style.display = 'none';
    }

	/**
	 * マーカーを生成するメソッド
	 */
	setMarker(store){
        const marker = new google.maps.marker.AdvancedMarkerElement({ // 各店舗のマーカーを生成
            map: this.mapManager.map,
            position: { lat: store.latitude, lng: store.longitude },
        });
        this.storeMarkers.push(marker); //マーカーをリストに格納
        this.mapManager.addToBounds({ lat: store.latitude, lng: store.longitude }); //矩形領域に各店舗の位置を追加
        return marker;
	}

	/**
	 * 各店舗の所要時間とルート検索ボタンを表示する、情報ウィンドウを生成するメソッド
	 */	
	setInfoWindow(store, marker){
        const infoWindow = new google.maps.InfoWindow({ // ウィンドウを生成
			// ルート検索で送信するために、spanで経緯度を保持
            content: `
                <div class='store-info-group'>
                    <span class='store-duration'>徒歩 ${store.duration}</span>
                    <span class='store-latitude'>${store.latitude}</span>
                    <span class='store-longitude'>${store.longitude}</span>
                    <button class='calc-route-button'><img class='calc-route-icon' src='/img/calc-route-icon.png' alt='route'/></button>
                </div>
            `
        });
        infoWindow.open(this.mapManager.map, marker); // ウィンドウを表示
        infoWindow.addListener('domready', () => { // domが読み込んでからでないと、ルート検索ボタンへのイベントを追加できない
            document.querySelectorAll('.calc-route-button').forEach(calcRouteButton => {
                calcRouteButton.addEventListener('click', () => this.calcRoute(calcRouteButton));
            });
        });		
	}

	/**
	 * ルート検索を行うメソッド
	 */
    calcRoute(calcRouteButton) {
        if (!this.locationManager.currentLatLng) { // 現在地が格納されていなければ検索せず、メッセージを表示
            NoticeManager.createFailCalcRouteNotice();
            return;
        }

		// ルート検索に用いるリクエストの作成
        const lngSpan = calcRouteButton.previousElementSibling;
        const latSpan = lngSpan.previousElementSibling;
        const storeLatLng = new google.maps.LatLng(latSpan.textContent, lngSpan.textContent); // 情報ウィンドウのspanにある目的地の経緯度を取得
        const request = {
            origin: this.locationManager.currentLatLng,
            destination: storeLatLng,
            travelMode: 'WALKING' // 移動手段を徒歩に指定
        };
		
		// ルート検索
        new google.maps.DirectionsService().route(request, (result, status) => { // 第一引数をリクエストすると返ってくるresultとstatusを第二引数の関数に渡す
        // ルート検索に成功したら、ルートと「店舗一覧に戻る」ボタンの表示
            if (status === 'OK') {
                this.storeMarkers.forEach(storeMarker => {
                    storeMarker.map = null; // 各店舗のマーカーを削除
                });
                this.mapManager.setDirections(result); // ルート表示
                this.showReturnToStoresListButton(); // 「店舗一覧に戻る」ボタンの表示
            } else {
                NoticeManager.createFailGetInformationNotice();
            }
        });
    }

	/**
	 * 「店舗一覧に戻る」ボタンを表示するメソッド
	 */
    showReturnToStoresListButton() {
        const returnToStoresListButton = document.getElementById('return-to-stores-list-button');
        returnToStoresListButton.style.display = 'block';
        returnToStoresListButton.addEventListener('click', this.returnToStoresList.bind(this));
    }

	/**
	 * 店舗一覧に戻るメソッド
	 */
    returnToStoresList() {
        this.mapManager.clearDirections(); // ルート案内を消すためにレンダラとマップの関連を削除
        this.mapManager.bounds = new google.maps.LatLngBounds(); // 最新の現在地のみを保持するために矩形領域をリセット
        this.storeMarkers.forEach(storeMarker => {
            storeMarker.map = this.mapManager.map; // 各店舗のマーカーを再表示
            this.mapManager.addToBounds(storeMarker.position); //各店舗の位置を再追加
        });
        this.mapManager.addToBounds(this.locationManager.currentLatLng); // 最新の現在地を追加（ルート検索の成功は、現在地の取得を保証している）
        this.mapManager.fitBounds();
        document.getElementById('return-to-stores-list-button').style.display = 'none'; //「店舗一覧に戻る」ボタンの非表示
    }
}