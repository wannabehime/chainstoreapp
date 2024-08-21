/**
 * メッセージ表示に関するクラス
 */
export class NoticeManager {
    
	static createNotice(id, text) {
		if(document.getElementById(id) == null){
		    const notice = document.createElement('div');
		    notice.id = id;
		    notice.textContent = text;
		    document.body.appendChild(notice);
		}
	}
	
	static removeNotice(id){
		if(document.getElementById(id) != null){
			document.getElementById(id).remove();
		}
	}
	
	static createAndRemoveNotice(id, text, duration = 3000){
		this.createNotice(id, text);
	    setTimeout(() => {
	        this.removeNotice(id);
	    }, duration);
	}
	
	static createGettingCurrentLocationNotice(){
		this.createNotice('getting-current-location-notice', '位置情報を取得中...')
	}
	
	static removeGettingCurrentLocationNotice(){
		this.removeNotice('getting-current-location-notice')
	}
	
	static createChooseFromListNotice(){
		this.createNotice('choose-from-list-notice', 'リストから駅名を選択してください')
	}
	
	static removeChooseFromListNotice(){
		this.removeNotice('choose-from-list-notice')
	}

	static createFailGetInformationNotice(){
		this.createAndRemoveNotice('fail-get-information-notice', '一時的に情報を取得できませんでした。時間をおいて再度お試しください')
	}
	
	static createNoStationNotice(){
		this.createAndRemoveNotice('no-station-notice', '該当する駅がありません。漢字やカタカナに変換するなどしてみてください')
	}

	static createFailSearchStoresNotice(){
		this.createAndRemoveNotice('fail-search-stores-notice', '現在地を取得できていないため、店舗検索ができません。駅名から検索してください', 4000)
	}

	static createChooseRightStationNotice(){
		this.createAndRemoveNotice('choose-right-station-notice', '正しい駅名を選択後、検索してください', 4000)
	}

	static createNoStoreNotice(){
		this.createAndRemoveNotice('no-store-notice', '該当する店舗がありませんでした')
	}

	static createFailCalcRouteNotice(){
		this.createAndRemoveNotice('fail-calc-route-notice', '現在地を取得できていないため、ルート検索ができません')
	}
}