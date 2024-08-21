import { NoticeManager } from './NoticeManager.js';

/**
 * 店舗検索フォームの駅名サジェストに関するクラス
 */
export class StationManager {
    constructor() {
        this.centerInput = document.getElementById('center'); // 店舗検索の中心が入力される要素
        this.stationsDataList = document.getElementById('stations-list'); // 駅名サジェストの候補を格納する要素
        this.stationLatLngInput = document.getElementById('station-latlng'); // 店舗検索の中心としての、駅の経緯度を格納するhidden要素
    }

	/**
	 * 入力値に応じて駅名をサジェストするメソッド
	 */
    getStations() {
        this.stationsDataList.innerHTML = ''; // サジェストする駅リストを初期化
        this.stationLatLngInput.value = ''; // 店舗検索の際に送信する駅の経緯度を初期化

		// 入力値がなくなったら「リストから...」を非表示にして処理を終了する
        if (!this.centerInput.value) {
            NoticeManager.removeChooseFromListNotice();
            return;
        }

        fetch(`/chainstoresearch/get-stations?input=${this.centerInput.value}`)
            .then(response => { //fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
                if (!response.ok) {
                    throw new Error(); //Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
                }
                return response.json(); //アロー関数の略記ではreturnしないと次のthenに値を渡せない
            })
            .then(stations => { //json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
                if (!stations.length) { // 該当する駅がなければメッセージを表示
                    NoticeManager.createNoStationNotice();
                    NoticeManager.removeChooseFromListNotice();
                } else {
					NoticeManager.createNoStationNotice();
                    this.getStationsSuccess(stations);
                }
            })
            .catch(error => {
                NoticeManager.createFailGetInformationNotice();
                NoticeManager.removeChooseFromListNotice();
            });
    }
	
	/**
	 * 駅名の取得に成功した場合の、サジェストを表示するメソッド
	 */
    getStationsSuccess(stations) {
        stations.forEach(station => { // 取得した各駅をリストに格納
            const option = document.createElement('option');
            option.value = station.name;
            option.dataset.latitude = station.latitude; // 店舗検索の際に用いる経緯度を格納
            option.dataset.longitude = station.longitude;
            this.stationsDataList.appendChild(option);
        });
        this.centerInput.setAttribute('list', 'stations-list');
        this.setStationLatLng();
        if(!this.stationLatLngInput.value){
			NoticeManager.createChooseFromListNotice();
		}else{
			NoticeManager.removeChooseFromListNotice();
		}
    }
	
	/**
	 * サジェストされた駅を選択したとき、店舗検索の際に送信する、検索の中心としての経緯度に設定するメソッド
	 */
    setStationLatLng() {
        const stationsListOptions = document.querySelectorAll('#stations-list option');
        [...stationsListOptions].forEach(stationsListOption => { // stationsListOptionsはループできないHTMLCollectionなので、...で一度バラバラにして配列に格納する
            if (stationsListOption.value === this.centerInput.value) { // 駅リストの各駅について、入力値と一致していたら（リストから駅が選択されていたら）店舗検索の際に送信する駅の経緯度に設定
                this.stationLatLngInput.value = stationsListOption.dataset.latitude + ', ' + stationsListOption.dataset.longitude;
            }
        });
    }
}