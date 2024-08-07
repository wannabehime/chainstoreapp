var directionsRenderer; // ルートをレンダリングするためのオブジェクトを格納する
let currentLatLng; // 現在地の経緯度オブジェクトを格納する
let map; // マップオブジェクトを格納する
const currentLocationInfoStatusDiv = document.getElementById('current-location-information-status'); // 位置情報取得の状態を表示する要素
let currentLocationMarker; // 現在地マーカーオブジェクトを格納する
let currentLocationCircle; // 現在地マーカーの周りの円オブジェクトを格納する
let storeMarkers = []; // 店舗マーカーを格納する配列
let bounds; // マップに表示する矩形領域オブジェクトを格納
const returnToStoresListButton = document.getElementById('return-to-stores-list-button');

//		====== 地図の初期化 ======
// 地図の読み込み時に実行される関数
function initMap(){
	directionsRenderer = new google.maps.DirectionsRenderer(); //ルートをレンダリングするためのオブジェクトを生成
	const watchPositionOptions = {
	  enableHighAccuracy: true, //精度（trueだと良い）
	  timeout: 5000, //現在地取得の制限時間
	  maximumAge: 0, //キャッシュの位置情報の有効期限。期限内だと新たに取得せずキャッシュから返す
	};
	navigator.geolocation.watchPosition(watchPositionSuccess, watchPositionFail, watchPositionOptions); // 現在地が取得できればsuccessに位置情報、できなければfailにエラーを渡す、optionsは各種設定
}

// watchPositionの成功時コールバック関数
function watchPositionSuccess(position){
	currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // 現在地のlatlngオブジェクトを更新
	document.getElementById('current-latlng').value = currentLatLng;  //店舗検索の中心地として、フォームのhiddenで送る現在地の更新
	currentLocationInfoStatusDiv.style.display = 'none'; //「位置情報を取得中...」の表示を消去
	
	if(typeof map === 'undefined'){	// マップがまだ存在しない場合は新しく作成
		const mapOptions = {
			zoom: 18,
			center: currentLatLng,
			mapId: "574de86c3981bebd"
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions); 
	}
	
	if (typeof currentLocationMarker === 'undefined'){ // マーカーがまだ存在しない場合は新しく作成
		const currentLocationMarkerDiv = document.createElement('div');
		currentLocationMarkerDiv.id = 'current-location-marker'; //cssで装飾する現在地マーカー
		currentLocationMarker = new google.maps.marker.AdvancedMarkerView({
            map,
			position: currentLatLng,
			content: currentLocationMarkerDiv,
		});
		currentLocationCircle = new google.maps.Circle({ //現在地マーカーの周りに誤差を表示する円
			//stroke:ライン
            strokeColor: '#115EC3', //青
            strokeOpacity: 0.2,
            strokeWeight: 1, //幅
            //fill:塗りつぶし
            fillColor: '#115EC3',
            fillOpacity: 0.2,
            map: map,
            center: currentLatLng,
            radius: 40
        });
	} else { 											// マーカーが存在する場合は位置を更新
		currentLocationMarker.position = currentLatLng;
		currentLocationCircle.setCenter(currentLatLng);
	}
}

// watchPositionの失敗時コールバック関数
function watchPositionFail(error){
	currentLocationInfoStatusDiv.style.display = 'block';
	if(typeof map === 'undefined'){
		const tokyoStationLatLng = new google.maps.LatLng(35.6812405, 139.7649361); //初期状態を東京駅とする
		const mapOptions = {
			zoom: 15,
			center: tokyoStationLatLng,
			mapId: "574de86c3981bebd"
		};
		map = new google.maps.Map(document.getElementById('map'), mapOptions); 
	}
}

//		====== 検索フォーム ======
//		------ ブランド名・予算セレクトボックスのテキストの色変更 ------
document.getElementById('brand-name').addEventListener('change', function(){
	colorChange(this);
});
document.getElementById('price-limit').addEventListener('change', function(){
	colorChange(this);
});
function colorChange(obj){
	if(obj.value === 'ブランド名を選択'){
	 	obj.style.color = '#7e7f7b'; //薄い灰色
	}else{
		obj.style.color = '#443D3A'; //ほぼ黒に近い茶色
	}		
}

//		------ 店舗検索の中心地の駅名サジェスト ------
const centerInput = document.getElementById('center');
centerInput.addEventListener('input', getStations); // 入力値から駅リストを取得し、サジェストとして表示

function getStations(){
	fetch(`/chainstoresearch/get-stations?input=${centerInput.value}`)
        .then(response => { //fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
			if(!response.ok){
				throw new Error(); //Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
			}
			return response.json(); //アロー関数の略記ではreturnしないと次のthenに値を渡せない
		})
        .then(stations => { //json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
			getStationsSuccess(stations);
		})
        .catch(error => {
			//駅リスト取得に失敗したら、失敗のメッセージ表示
			const getInfoStatusDiv = document.getElementById('get-information-status');
            getInfoStatusDiv.style.display = 'block';
            setTimeout(function(){ //3秒で消える
				getInfoStatusDiv.style.display = 'none';
			}, 3000);
			// TODO: リストから駅名を選択してほしい旨を表示
        });	
}

function getStationsSuccess(stations){
	const stationsDataList = document.getElementById('stations-list');
	stationsDataList.innerHTML = ''; // サジェストする駅リストを初期化
	
	if(stations.length === 0){
		const getStationStatusDiv = document.getElementById('get-station-status');
        getStationStatusDiv.style.display = 'block';
        setTimeout(function(){ //3秒で消える
			getStationStatusDiv.style.display = 'none';
		}, 3000);
	} else{
	   stations.forEach(station => { // 取得した各駅をリストに格納
	        const option = document.createElement('option');
			option.value = station.name;
			option.dataset.latitude = station.latitude; // 店舗検索の際に用いる経緯度を格納
			option.dataset.longitude = station.longitude;
	        stationsDataList.appendChild(option);
	    });
	}
    centerInput.setAttribute('list', 'stations-list');
    
   	setStationLatLng(); // サジェストされた駅を選択したとき、店舗検索の際に送信する駅の経緯度に設定
}

function setStationLatLng(){
	const stationLatLngInput = document.getElementById('station-latlng')
	stationLatLngInput.value = ''; // 店舗検索の際に送信する駅の経緯度を初期化
    const stationsListOptions = document.querySelectorAll('#stations-list option');
    [...stationsListOptions].forEach(stationsListOption => { // stationsListOptionsはループできないHTMLCollectionなので、...で一度バラバラにして配列に格納する
		if(stationsListOption.value === centerInput.value){ // 駅リストの各駅について、入力値と一致していたら（リストから駅が選択されていたら）店舗検索の際に送信する駅の経緯度に設定
			stationLatLngInput.value = stationsListOption.dataset.latitude + ', ' + stationsListOption.dataset.longitude;
		}
	});
}
				
//		------ 「現在地を指定」ボタン ------
document.getElementById('set-current-location-button').addEventListener('click', function(){
	document.getElementById('center').value = '現在地';
});
		
//		------ 店舗検索 ------
const searchFormContainerDiv = document.getElementById('search-form-wrapper');
searchFormContainerDiv.addEventListener('submit', function(e){
    e.preventDefault(); //フォームの本来のリクエストを阻止
    const request = new URLSearchParams(new FormData(searchFormContainerDiv)).toString(); //FormData:フォームの内容をキーと値で格納, URLSearchParams:クエリ文字列を生成
    fetch(`/chainstoresearch/search-stores?${request}`)
        .then(response => {
			if(!response.ok){
				throw new Error();
			}
			return response.json();
		})
        .then(stores => {
            searchStoresSuccess(stores);
        })
        .catch(error => {
			// TODO: エラー時どうする
            alert('通信に失敗しました。ステータス：' + error);
        });
});

function searchStoresSuccess(stores){
	initMarkersAndButton(); //マーカーとボタンの初期化
	setMarkersAndInfoWindows(stores); //マーカーと情報ウィンドウを生成
	displayMenuResultsContainer(); //メニューを表示するコンテナを表示
}

function initMarkersAndButton(){
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	storeMarkers.forEach(storeMarker => {
    	storeMarker.map = null; // 各店舗のマーカーを削除
    });
	storeMarkers = []; // マーカーリストを初期化
	bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域のインスタンスを生成
	document.getElementById('return-to-stores-list-button').style.display = 'none';
}

function setMarkersAndInfoWindows(stores){
	/*JSON.parse(*/stores/*)*/.forEach(store => { // JSONデータをJavaScriptのオブジェクトに変換
	
		//	------各店舗のマーカーを生成------
		const marker = new google.maps.marker.AdvancedMarkerElement({
			map,
            position: {lat: store.latitude, lng: store.longitude},
        });
		storeMarkers.push(marker); //マーカーをリストに格納
		bounds.extend({lat: store.latitude, lng: store.longitude}); //矩形領域に各店舗の位置を追加
		
		//	------各店舗の所要時間とルート検索ボタンを表示する、情報ウィンドウを生成------
		const infoWindow = new google.maps.InfoWindow({
			//ルート検索で送信するために、spamで経緯度を保持
            content: `
            	<div class='store-info-group'>
	                <span class='store-duration'>徒歩 ${store.duration}</span>
					<span class='store-latitude'>${store.latitude}</span>
					<span class='store-longitude'>${store.longitude}</span>
					<button class='calc-route-button'><img class='calc-route-icon' src='/img/calc-route-icon.png' alt='route'/></button>
				</div>
            `
        });
        infoWindow.open(map, marker); //ウィンドウを表示
		infoWindow.addListener('domready', function(){ //domが読み込んでからでないと、ルート検索ボタンへのリスナーを追加できない
	        document.querySelectorAll('.calc-route-button').forEach(calcRouteButton => {
	            calcRouteButton.addEventListener('click', function(){
	                calcRoute(this);
	            });
	        });
        });
    });
    
   	if(currentLatLng !== 'undefined'){
		bounds.extend(currentLatLng); //現在地が取得できていれば矩形領域に追加
	}
	map.fitBounds(bounds); //マップに矩形領域を伝える
}

function displayMenuResultsContainer(){
	document.getElementById('menu-board-container').style.display = 'block';
	document.getElementById('price-limit').options[0].selected = true; //予算設定を初期値に戻す
	const menuResultsContainerDiv = document.getElementById('menu-result-container');
	while (menuResultsContainerDiv.firstChild){
	  menuResultsContainerDiv.removeChild(menuResultsContainerDiv.firstChild); //メニュー表示を全消去して初期化
	}	
}

//		====== ルート検索 ======
function calcRoute(calcRouteButton){
	//ルート検索に用いるリクエストの作成
    const lngSpan = calcRouteButton.previousElementSibling;
    const latSpan = lngSpan.previousElementSibling;
    const storeLatLng = new google.maps.LatLng(latSpan.textContent, lngSpan.textContent); // 情報ウィンドウのspanにある目的地の経緯度を取得
    const request = {
        origin: currentLatLng,
        destination: storeLatLng,
        travelMode: 'WALKING' //移動手段を徒歩に指定
    };
    
    directionsRenderer.setMap(map); // レンダラに結びつける地図情報を与える
    //ルート検索
    new google.maps.DirectionsService().route(request, (result, status) => { // 第一引数をリクエストすると返ってくるresultとstatusを第二引数の関数に渡す
        //ルート検索に成功したら、ルートと「店舗一覧に戻る」ボタンの表示
        if (status === 'OK'){
            storeMarkers.forEach(storeMarker => {
            	storeMarker.map = null; // 各店舗のマーカーを削除
            });
			directionsRenderer.setDirections(result); // ルート表示
			
			returnToStoresListButton.style.display = 'block'; //「店舗一覧に戻る」ボタンの表示
			returnToStoresListButton.addEventListener('click', returnToStoresList);
        } else {
			//ルート検索に失敗したら、失敗のメッセージ表示
			const getInfoStatusDiv = document.getElementById('get-information-status');
            getInfoStatusDiv.style.display = 'block';
            setTimeout(function(){ //3秒で消える
				getInfoStatusDiv.style.display = 'none';
			}, 3000);
        }
    });
}
		
//		====== 「店舗一覧に戻る」ボタン ======
function returnToStoresList(){
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	
    bounds = new google.maps.LatLngBounds(); // 最新の現在地のみを保持するために矩形領域をリセット
    storeMarkers.forEach(storeMarker => {
        storeMarker.map = map; // 各店舗のマーカーを再表示
		bounds.extend(storeMarker.position); //各店舗の位置を再追加
    });
    bounds.extend(currentLatLng); // 最新の現在地を追加（ルート検索の成功は、現在地の取得を保証している）
    map.fitBounds(bounds);
    
    returnToStoresListButton.style.display = 'none'; //「店舗一覧に戻る」ボタンの非表示
}
		
//		====== メニュー検索 ======
//		------予算変更によるメニュー初期化の発火を設定------
document.getElementById('price-limit').addEventListener('change', function(){
	initMenus(this);
});

//		------メニュー表示のラッパーを作成し、最初のランダムなメニューを表示------
function initMenus(priceLimitDiv){
	if(priceLimitDiv.value === '---'){ // 予算選択で"---"が選ばれた場合は何もしない
		return;
	}
	
	// メニュー表示のコンテナをクリア
	const menuResultContainer = document.getElementById('menu-result-container');
	while (menuResultContainer.firstChild){
		menuResultContainer.removeChild(menuResultContainer.firstChild);
	}
	
	const brandName = document.getElementById('brand-name').value;
	const priceLimit = document.getElementById('price-limit').value;
	// メニュー表示のラッパーを作成
	const firstMenuResultWrapper = createMenuResultWrapper(menuResultContainer);
	const secondMenuResultWrapper = createMenuResultWrapper(menuResultContainer);
	// 最初のランダムなメニューを表示
    shuffleMenus(brandName, priceLimit, firstMenuResultWrapper);
    shuffleMenus(brandName, priceLimit, secondMenuResultWrapper);
}

//		------ メニュー表示のラッパーを作成 ------
function createMenuResultWrapper(menuResultContainer){
	const menuResultWrapper = document.createElement('div');
	menuResultWrapper.className = 'menu-result-wrapper';
	menuResultContainer.appendChild(menuResultWrapper);
	
	return menuResultWrapper;
}
//		------ メニューをシャッフル ------
function shuffleMenus(brandName, priceLimit, menuResultWrapper){
    fetch(`/chainstoresearch/get-menus?brandName=${brandName}&priceLimit=${priceLimit}`)
        .then(response => {
			if(!response.ok){
				throw new Error();
			}
			return response.json();
		})
        .then(menus => {
            shuffleMenusSuccess(brandName, priceLimit, menuResultWrapper, menus);
        })
        .catch(error => {
			//メニュー検索に失敗したら、失敗のメッセージ表示
			const getInfoStatusDiv = document.getElementById('get-information-status');
            getInfoStatusDiv.style.display = 'block';
            setTimeout(function(){ //3秒で消える
				getInfoStatusDiv.style.display = 'none';
			}, 3000);
        });
}

//		------ shuffleMenus内fetchの成功時に呼び出される関数 ------
function shuffleMenusSuccess(brandName, priceLimit, menuResultWrapper, menus){
	// メニュー表示のラッパーをクリア
	while (menuResultWrapper.firstChild){
		menuResultWrapper.removeChild(menuResultWrapper.firstChild);
	}
	
	const {menuBoxDiv, priceCounter} = createMenuBox(menus); //メニューの生成
	const totalPriceBoxDiv = createTotalPriceBox(priceCounter); //合計金額の生成
	const shuffleMenusButton = createShuffleMenusButton(brandName, priceLimit, menuResultWrapper); //シャッフルボタンの生成

	//	生成した要素を集約
	const menuResultGroupDiv = document.createElement('div');
	menuResultGroupDiv.className = 'menu-result-group';
	menuResultGroupDiv.appendChild(menuBoxDiv);
	menuResultGroupDiv.appendChild(totalPriceBoxDiv);
	menuResultWrapper.appendChild(menuResultGroupDiv);
	menuResultWrapper.appendChild(shuffleMenusButton);
}

//		------ メニューの生成 ------
function createMenuBox(menus){
	let priceCounter = 0; // createTotalPriceBox関数で用いる合計金額のカウンター
	// メニューdivを入れるボックスの生成
	const menuBoxDiv = document.createElement('div');
	menuBoxDiv.className = 'menu-box';

    menus.forEach(menu => {
		// メニュー名と価格を入れるdivの生成
		const menuDiv = document.createElement('div');
		menuDiv.className = 'menu';
		
		// メニュー名の生成
		const menuNameSpan = document.createElement('span');
		menuNameSpan.className = 'menu-name';
		menuNameSpan.textContent = menu.name;
		// 価格の生成
		const menuPriceSpan = document.createElement('span');
		menuPriceSpan.className = 'menu-price';
		menuPriceSpan.textContent = menu.price + '円';
		
		// メニュー名と価格をメニューdivに、メニューdivをボックスに入れる
		menuDiv.appendChild(menuNameSpan);
		menuDiv.appendChild(menuPriceSpan);
		menuBoxDiv.appendChild(menuDiv);
		// 合計金額を累加する
        priceCounter += parseInt(menu.price);
    });
    
    return {menuBoxDiv, priceCounter};
}

//		------ 合計金額の生成 ------
function createTotalPriceBox(priceCounter){
	// 合計金額の前に表示する「合計」の生成
	const totalPriceSymbolSpan = document.createElement('span');
	totalPriceSymbolSpan.className = 'total-price-symbol';
	totalPriceSymbolSpan.textContent = '合計';
	
	// 合計金額の生成
	const totalPriceValueSpan = document.createElement('span');
	totalPriceValueSpan.className = 'total-price-value';
	totalPriceValueSpan.textContent = priceCounter + '円';
	
	// spanを生成し、合計金額と「合計」を入れる
	const totalPriceSpan = document.createElement('span');
	totalPriceSpan.className = 'total-price';
	totalPriceSpan.appendChild(totalPriceSymbolSpan);
	totalPriceSpan.appendChild(totalPriceValueSpan);
	
	// divを生成し、spanを入れる
	const totalPriceBoxDiv = document.createElement('div');
	totalPriceBoxDiv.className = 'total-price-box';
	totalPriceBoxDiv.appendChild(totalPriceSpan);
	
	return totalPriceBoxDiv;
}

//		------ シャッフルボタンの生成 ------
function createShuffleMenusButton(brandName, priceLimit, menuResultWrapper){
	const shuffleMenusButton = document.createElement('button');
	shuffleMenusButton.className = 'shuffle-menus-button';
	shuffleMenusButton.textContent = 'シャッフル';
	shuffleMenusButton.addEventListener('click', function(){
	    shuffleMenus(brandName, priceLimit, menuResultWrapper);
	});
	
	return shuffleMenusButton;
}