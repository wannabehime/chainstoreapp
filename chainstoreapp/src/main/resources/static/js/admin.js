//		====== ブランド名・予算セレクトボックスのテキストの色変更 ======
document.getElementById('brand-name').addEventListener('change', function(){
	colorChange(this);
});
document.getElementById('price-limit').addEventListener('change', function(){
	colorChange(this);
});
function colorChange(obj){
	if(['ブランド名を選択', '---'].includes(obj.value)){
	 	obj.style.color = '#7e7f7b';
	}else{
		obj.style.color = '#443D3A';
	}		
}
				
//	   ====== 「現在地から検索」ボタン ======
document.getElementById('set-current-location-button').addEventListener('click', function(){
	document.getElementById('center').value = '現在地';
});
					
//		====== 検索の中心のオートコンプリート ======
document.addEventListener('DOMContentLoaded', suggestStaionNames);
function suggestStaionNames(){
	const center = document.getElementById('center');
    center.addEventListener('input', function() {
        if (center.value.length >= 2) {
            fetch(`/chainstoresearch/getstationnames?input=${center.value}`)
                .then(response => response.json())
                .then(data => {
                    const stationNameslist = document.getElementById('station-name-list');
                    stationNameslist.innerHTML = '';
                    data.forEach(item => {
                        const option = document.createElement('option');
                        option.value = item;
                        stationNameslist.appendChild(option);
                    });
                    center.setAttribute('list', 'station-name-list');
                })
                .catch(error => {
                    // TODO: エラー時どうする
                });
        }
    });
}
		
//		====== 地図の初期化 ======
var directionsRenderer;
let currentLatLng;		
let map;
let markers = [];
let bounds;

function initMap() {
	let currentMarker;
	directionsRenderer = new google.maps.DirectionsRenderer();
	
	function success(position) {
		currentLatLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); // 現在地のlatlngオブジェクトを格納
		
		document.getElementById('current-latlng').value = currentLatLng;  //店舗検索の中心として、フォームのhiddenで送る現在地の更新
		
		if(typeof map === 'undefined'){
			let mapOptions = {
				zoom: 15,
				center: currentLatLng,
				mapId: "574de86c3981bebd"
			};
			// TODO: mapoptionはmapIdだけでいい？
			map = new google.maps.Map(document.getElementById('map'), mapOptions); 	// マップがまだ存在しない場合は新しく作成
		}
				
		if (typeof currentMarker === 'undefined') { // マーカーがまだ存在しない場合は新しく作成
			const iconDiv = document.createElement('div');
			iconDiv.style.backgroundColor = '#115EC3';
			iconDiv.style.border = '2px solid white';
			iconDiv.style.borderRadius = '50%';
			iconDiv.style.width = '18px';
			iconDiv.style.height = '18px';
			iconDiv.style.boxShadow = '0 0 6px rgba(0, 0, 0, 0.5)';
			
			currentMarker = new google.maps.marker.AdvancedMarkerView({
                map,
				position: currentLatLng,
				content: iconDiv,
    		});
			
			new google.maps.Circle({
	            strokeColor: '#115EC3',
	            strokeOpacity: 0.2,
	            strokeWeight: 1,
	            fillColor: '#115EC3',
	            fillOpacity: 0.2,
	            map: map,
	            center: currentLatLng,
	            radius: 40
	        });   
		} else { 							// マーカーが存在する場合は位置を更新
			currentMarker.position = currentLatLng;
		}
		
	}

	function fail(error) {
		alert('位置情報の取得に失敗しました。エラーコード：' + error.code);
		if(typeof map === 'undefined'){
			let latLng = new google.maps.LatLng(35.6812405, 139.7649361); //東京駅
			let mapOptions = {
				zoom: 15,
				center: latLng,
				mapId: "574de86c3981bebd"
			};
			map = new google.maps.Map(document.getElementById('map'), mapOptions); 	// マップがまだ存在しない場合は新しく作成
		}
		
	}
	
	const options = {
	  enableHighAccuracy: true, //精度（trueだと良い）
	  timeout: 5000, //制限時間
	  maximumAge: 0, //キャッシュの位置情報の有効期限。期限内だと新たに取得せずキャッシュから返す
	};
	
	navigator.geolocation.watchPosition(success, fail, options); // 現在地が取得できればsuccessに位置情報、できなければfail関数にエラーを代入、optionsは各種設定
}
		
//		====== 店舗検索 ======
document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('search-form-container');
    searchForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const request = new URLSearchParams(new FormData(searchForm)).toString();
        fetch(`/chainstoresearch/storesearch?${request}`)
            .then(response => response.text())
            .then(response => {
                storeSuccess(response);
            })
            .catch(error => {
				// TODO: エラー時どうする
                alert('通信に失敗しました。ステータス：' + error);
            });
    });
});

function storeSuccess(response) {
	markers.forEach(marker => {
    	marker.map = null; // 各店舗のマーカーを削除
    });
	markers = []; // マーカーを初期化
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	
	bounds = new google.maps.LatLngBounds(); // マップに表示する矩形領域インスタンス生成
	
	let responseObj = JSON.parse(response); // JSONデータをパースしてJavaScriptのオブジェクトに変換
	responseObj.forEach(obj => {
		let marker = new google.maps.marker.AdvancedMarkerElement({ //各店舗のマーカーを生成
            position: {lat: obj.lat, lng: obj.lng},
            map: map
        });
		
		let infowindow = new google.maps.InfoWindow({
            content: `
                <strong>${obj.duration}</strong>
				<input class='hiddens' type='hidden' value=${obj.lat} name='${obj.lng}'></input>
				<button id='calc-route-btn'>ルート</button>
            `
        });
        infowindow.open(map, marker);
		
		markers.push(marker); //マーカーを格納
		bounds.extend({lat: obj.lat, lng: obj.lng}); //矩形領域に各店舗の位置を追加
    });
	//document.getElementById('back-to-list-btn').remove(); // 既存のボタンを削除
	document.querySelector('#menu-board-container').style.display = "block"; // メニュー検索の予算設定セレクトボックスを表示
	let menuResultContainer = document.getElementById('menu-result-container');
	while (menuResultContainer.firstChild) {
	  menuResultContainer.removeChild(menuResultContainer.firstChild);
	}
	
	if(currentLatLng !== 'undefined'){
		bounds.extend(currentLatLng); //現在地が取得できていれば矩形領域に追加
	}
	map.fitBounds(bounds); //マップに矩形領域を伝える
	
	document.getElementById('calc-route-btn').addEventListener('click', function() {
        calcRoute(this);
    }); // ルート検索ボタンにイベントを追加
	//document.getElementById('back-to-list-button').addEventListener('click', backToList);
}
		
//		====== メニュー検索 ======
// TODO: 「--予算を選んでください--」が選ばれてしまったらどうする。ホバーでドロップダウンの方がいいか
document.getElementById('price-limit').addEventListener('change', initMenus); // 予算の上限が変更されたとき、最初のランダムなメニューを表示

function initMenus() {
	const menuResultContainer = document.getElementById('menu-result-container');
	while (menuResultContainer.firstChild) { // メニューの表示場所をクリア
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

function shuffleAndDisplayMenu(brandName, priceLimit, menuResultsDiv) {
    fetch(`/chainstoresearch/menusearch?priceLimit=${priceLimit}&brandName=${brandName}`)
        .then(response => response.json())
        .then(response => {
            displayMenu(response, menuResultsDiv, brandName, priceLimit);
        })
        .catch(error => {
            alert('通信に失敗しました。ステータス：' + error);
        });
}

function displayMenu(response, menuResultsDiv, brandName, priceLimit) {
	while (menuResultsDiv.firstChild) { // メニューの表示場所をクリア
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
	
	const totalPriceSimbol = document.createElement('span');
	totalPriceSimbol.className = 'total-price-simbol';
	totalPriceSimbol.textContent = '合計';
	
	const totalPriceValue = document.createElement('span');
	totalPriceValue.className = 'total-price-value';
	totalPriceValue.textContent = priceCount + '円';
	
	totalPrice.appendChild(totalPriceSimbol);
	totalPrice.appendChild(totalPriceValue);
	totalPriceBox.appendChild(totalPrice);
	
	menuContainer.appendChild(totalPriceBox);
	menuResultsDiv.appendChild(menuContainer);
	
	const shuffleButton = document.createElement('button');
	shuffleButton.textContent = 'シャッフル';
	shuffleButton.className = 'shuffle-button';
	shuffleButton.addEventListener('click', function() {
	    shuffleAndDisplayMenu(brandName, priceLimit, menuResultsDiv);
	});
	
	menuResultsDiv.appendChild(shuffleButton);
}	
			
//		====== ルート検索 ======
function calcRoute(obj) {
    directionsRenderer.setMap(map); // レンダラに結びつける地図情報を与える
    
    let preSibling = obj.previousElementSibling;
    let desLatLng = new google.maps.LatLng(preSibling.value, preSibling.getAttribute('name')); // hiddenにある目的地の経緯度を取得
    let request = {
        origin: currentLatLng, // 現在地の経緯度
        destination: desLatLng,
        travelMode: 'WALKING'
    };
    
    new google.maps.DirectionsService().route(request, (result, status) => { // 第一引数をリクエストすると返ってくるresultとstatusを第二引数の関数に渡す
        if (status === 'OK') {
            markers.forEach(marker => {
            	marker.map = null; // 各店舗のマーカーを削除
            });
			directionsRenderer.setDirections(result); // ルートをマップに表示
			document.getElementById('back-to-list-button').style.display = 'block';
        } else {
            alert(status);
        }
    });
}
		
//		====== 一覧に戻る ======
function backToList(){
	directionsRenderer.setMap(null); // ルート案内を消すためにレンダラとマップの関連を削除
	
    bounds = new google.maps.LatLngBounds(); // 最新の現在地のみを保持するために矩形領域をリセット
    bounds.extend(currentLatLng); // 最新の現在地を追加
    markers.forEach(marker => {
        marker.map = map; // 各店舗のマーカーを再表示
		bounds.extend(marker.position); //各店舗の位置を再追加
    });
    map.fitBounds(bounds); // マップに矩形領域を伝える
}