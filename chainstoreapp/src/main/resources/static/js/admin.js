var directionsRenderer;
let currentLatLng;
let map;
const currentLocationInfoStatusDiv = document.getElementById('current-location-information-status');
let currentLocationMarker;
let currentLocationCircle;
let markers = [];
let bounds;

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

//		------ 店舗検索の中心地のサジェスト ------
const centerInput = document.getElementById('center');
centerInput.addEventListener('input', function(){
	fetch(`/chainstoresearch/getstationnames?input=${centerInput.value}`)
        .then(response => { //fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
			if(!response.ok){
				throw new Error(); //Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
			}
			return response.json(); //アロー関数の略記ではreturnしないと次のthenに値を渡せない
		})
        .then(stationNames => { //json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
        	const staionNamesDataList = document.getElementById('station-name-list');
			staionNamesDataList.innerHTML = '';
            stationNames.forEach(stationName => {
                const option = document.createElement('option');
                option.value = stationName;
                staionNamesDataList.appendChild(option);
            });
            centerInput.setAttribute('list', 'station-name-list');
		})
        .catch(error => {
            console.log(error); //ユーザーには知らせる必要がないので、コンソールに表示
        });
});
				
//		------ 「現在地を指定」ボタン ------
document.getElementById('set-current-location-button').addEventListener('click', function(){
	document.getElementById('center').value = '現在地';
});
		
//		------ 店舗検索 ------
const searchFormContainerDiv = document.getElementById('search-form-wrapper');
searchFormContainerDiv.addEventListener('submit', function(e){
    e.preventDefault(); //フォームの本来のリクエストを阻止
    const request = new URLSearchParams(new FormData(searchFormContainerDiv)).toString(); //FormData:フォームの内容をキーと値で格納, URLSearchParams:クエリ文字列を生成
    fetch(`/chainstoresearch/storesearch?${request}`)
        .then(response => {
			if(!response.ok){
				throw new Error();
			}
			return response.text();
		})
        .then(storesInfo => {
            searchStoresSuccess(storesInfo);
        })
        .catch(error => {
			// TODO: エラー時どうする
            alert('通信に失敗しました。ステータス：' + error);
        });
});

function searchStoresSuccess(storesInfo){
	initMarkersAndButton(); //マーカーとボタンの初期化
	setMarkersAndInfoWindows(storesInfo); //マーカーと情報ウィンドウを生成
	displayMenuResultsContainer(); //メニューを表示するコンテナを表示
}

function initMarkersAndButton(){
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	markers.forEach(marker => {
    	marker.map = null; // 各店舗のマーカーを削除
    });
	markers = []; // マーカーリストを初期化
	bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域のインスタンスを生成
	document.getElementById('return-to-stores-list-button').style.display = 'none';
}

function setMarkersAndInfoWindows(storesInfo){
	JSON.parse(storesInfo).forEach(storeInfo => { // JSONデータをJavaScriptのオブジェクトに変換
	
		//	------各店舗のマーカーを生成------
		const marker = new google.maps.marker.AdvancedMarkerElement({
			map,
            position: {lat: storeInfo.lat, lng: storeInfo.lng},
        });
		markers.push(marker); //マーカーをリストに格納
		bounds.extend({lat: storeInfo.lat, lng: storeInfo.lng}); //矩形領域に各店舗の位置を追加
		
		//	------各店舗の所要時間とルート検索ボタンを表示する、情報ウィンドウを生成------
		const infoWindow = new google.maps.InfoWindow({
			//ルート検索で送信するために、spamで経緯度を保持
            content: `
            	<div class='store-info-group'>
	                <span class='store-duration'>徒歩 ${storeInfo.duration}</span>
					<span class='store-lat'>${storeInfo.lat}</span>
					<span class='store-lng'>${storeInfo.lng}</span>
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
    const destinationLatLng = new google.maps.LatLng(latSpan.textContent, lngSpan.textContent); // 情報ウィンドウのspanにある目的地の経緯度を取得
    const request = {
        origin: currentLatLng,
        destination: destinationLatLng,
        travelMode: 'WALKING' //移動手段を徒歩に指定
    };
    
    directionsRenderer.setMap(map); // レンダラに結びつける地図情報を与える
    //ルート検索
    new google.maps.DirectionsService().route(request, (result, status) => { // 第一引数をリクエストすると返ってくるresultとstatusを第二引数の関数に渡す
        //ルート検索に成功したら、ルートと「店舗一覧に戻る」ボタンの表示
        if (status === 'OK'){
            markers.forEach(marker => {
            	marker.map = null; // 各店舗のマーカーを削除
            });
			directionsRenderer.setDirections(result); // ルート表示
			
			const returnToStoresListButton = document.getElementById('return-to-stores-list-button');
			returnToStoresListButton.style.display = 'block'; //「店舗一覧に戻る」ボタンの表示
			returnToStoresListButton.addEventListener('click', returnToStoresList);
        } else {
			//ルート検索に失敗したら、失敗のメッセージ表示
			const calcRouteInfoStatusDiv = document.getElementById('calc-route-information-status');
            calcRouteInfoStatusDiv.style.display = 'block'; //
            setTimeout(function(){ //3秒で消える
				calcRouteInfoStatusDiv.style.display = 'none';
			}, 3000);
        }
    });
}
		
//		====== 「店舗一覧に戻る」ボタン ======
function returnToStoresList(){
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	
    bounds = new google.maps.LatLngBounds(); // 最新の現在地のみを保持するために矩形領域をリセット
    markers.forEach(marker => {
        marker.map = map; // 各店舗のマーカーを再表示
		bounds.extend(marker.position); //各店舗の位置を再追加
    });
    bounds.extend(currentLatLng); // 最新の現在地を追加（ルート検索の成功は、現在地の取得を保証している）
    map.fitBounds(bounds);
}
		
//		====== メニュー検索 ======
// TODO: 「--予算を選んでください--」が選ばれてしまったらどうする。ホバーでドロップダウンの方がいいか
document.getElementById('price-limit').addEventListener('change', initMenus); // 予算の上限が変更されたとき、最初のランダムなメニューを表示

function initMenus(){
	const menuResultContainer = document.getElementById('menu-result-container');
	while (menuResultContainer.firstChild){ // メニューの表示場所をクリア
		menuResultContainer.removeChild(menuResultContainer.firstChild);
	}
	
	const firstMenuResultsDiv = document.createElement('div');
	firstMenuResultsDiv.className = 'menu-result-wrapper';
	const secondMenuResultsDiv = document.createElement('div');
	secondMenuResultsDiv.className = 'menu-result-wrapper';
	
	const brandName = document.getElementById('brand-name').value;
	const priceLimit = document.getElementById('price-limit').value;
	
	menuResultContainer.appendChild(firstMenuResultsDiv);
	menuResultContainer.appendChild(secondMenuResultsDiv);
    shuffleAndDisplayMenu(brandName, priceLimit, firstMenuResultsDiv);
    shuffleAndDisplayMenu(brandName, priceLimit, secondMenuResultsDiv);
}

function shuffleAndDisplayMenu(brandName, priceLimit, menuResultsDiv){
    fetch(`/chainstoresearch/menusearch?priceLimit=${priceLimit}&brandName=${brandName}`)
        .then(response => response.json())
        .then(response => {
            displayMenu(response, menuResultsDiv, brandName, priceLimit);
        })
        .catch(error => {
            alert('通信に失敗しました。ステータス：' + error);
        });
}

function displayMenu(response, menuResultsDiv, brandName, priceLimit){
	while (menuResultsDiv.firstChild){ // メニューの表示場所をクリア
		menuResultsDiv.removeChild(menuResultsDiv.firstChild);
	}
    let priceCount = 0; // 累計金額カウンター
	
	const menuContainer = document.createElement('div');
	menuContainer.className = 'menu-result-group';
	const menuWrapper = document.createElement('div');
	menuWrapper.className = 'menu-box';

    response.forEach(obj => {
		const resultDiv = document.createElement('div');
		resultDiv.className = 'menu';
		
		const nameSpan = document.createElement('span');
		nameSpan.className = 'menu-name';
		nameSpan.textContent = obj.name;
		const priceSpan = document.createElement('span');
		priceSpan.className = 'menu-price';
		priceSpan.textContent = obj.price + '円';
		
		resultDiv.appendChild(nameSpan);
		resultDiv.appendChild(priceSpan);
		menuWrapper.appendChild(resultDiv);
        priceCount += parseInt(obj.price);
    });
	menuContainer.appendChild(menuWrapper);

	const totalPriceBox = document.createElement('div');
	totalPriceBox.className = 'total-price-box';
	
	const totalPrice = document.createElement('span');
	totalPrice.className = 'total-price';
	
	const totalPriceSymbol = document.createElement('span');
	totalPriceSymbol.className = 'total-price-symbol';
	totalPriceSymbol.textContent = '合計';
	
	const totalPriceValue = document.createElement('span');
	totalPriceValue.className = 'total-price-value';
	totalPriceValue.textContent = priceCount + '円';
	
	totalPrice.appendChild(totalPriceSymbol);
	totalPrice.appendChild(totalPriceValue);
	totalPriceBox.appendChild(totalPrice);
	
	menuContainer.appendChild(totalPriceBox);
	menuResultsDiv.appendChild(menuContainer);
	
	const shuffleButton = document.createElement('button');
	shuffleButton.textContent = 'シャッフル';
	shuffleButton.className = 'shuffle-button';
	shuffleButton.addEventListener('click', function(){
	    shuffleAndDisplayMenu(brandName, priceLimit, menuResultsDiv);
	});
	
	menuResultsDiv.appendChild(shuffleButton);
}