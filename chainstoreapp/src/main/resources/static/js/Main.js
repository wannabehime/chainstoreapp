import { MapManager } from './MapManager.js';
import { LocationManager } from './LocationManager.js';
import { StationManager } from './StationManager.js';
import { StoreManager } from './StoreManager.js';
import { MenuManager } from './MenuManager.js';
import { NoticeManager } from './NoticeManager.js';

window.addEventListener('load', () => {
    const mapManager = new MapManager();
    const locationManager = new LocationManager(mapManager);
    const stationManager = new StationManager();
    const menuManager = new MenuManager();
    const storeManager = new StoreManager(mapManager, locationManager, menuManager);
    const centerInput = document.getElementById('center');

    // 地図の初期化
    locationManager.watchCurrentLocation();
    
    // ブランド名の色変更
    document.getElementById('brand-name').addEventListener('change', function() {
        this.style.color = '#443D3A'; // ほぼ黒に近い茶色
    });

    // 駅名サジェスト
    centerInput.addEventListener('input', stationManager.getStations.bind(stationManager));

    // 「現在地を指定」ボタン
    document.getElementById('set-current-location-button').addEventListener('click', () => {
        centerInput.value = '現在地';
    });

    // 店舗検索
    const searchFormWrapperDiv = document.getElementById('search-form-wrapper');
    searchFormWrapperDiv.addEventListener('submit', (e) => {
        e.preventDefault(); //フォームの本来のリクエストを阻止
        if (centerInput.value == '現在地' && !locationManager.currentLatLng) {
			// 中心地に「現在地」を指定した上で、現在地の経緯度が格納されていなければ、失敗のメッセージ表示し、送信しない
            NoticeManager.createFailSearchStoresNotice();
        } else if (centerInput.value != '現在地' && !stationManager.stationLatLngInput.value) {
			// 中心地に駅名を指定した上で、駅の経緯度が格納されていなければ、失敗のメッセージ表示し、送信しない
            NoticeManager.createChooseRightStationNotice();
        } else {
            storeManager.searchStores(new FormData(searchFormWrapperDiv)); // FormData:フォームの内容をキーと値で格納
        }
    });

    // メニュー検索
	document.getElementById('price-limit').addEventListener('change', menuManager.initMenus.bind(menuManager));
    
    // 「シャッフル」ボタン
    document.querySelectorAll('.shuffle-menus-button').forEach(button => {
        button.addEventListener('click', () => {
            menuManager.getMenus(button.closest('.menu-result-wrapper'));
        });
    });
});