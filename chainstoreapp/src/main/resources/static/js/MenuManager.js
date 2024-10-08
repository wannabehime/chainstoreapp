import { NoticeManager } from './NoticeManager.js';

/**
 * メニューに関するクラス
 */
export class MenuManager {
    constructor() {
		// メニューとシャッフルボタンのセットを格納するコンテナ
		this.menuResultContainer = document.getElementById('menu-result-container');
    }

	/**
	 * 店舗検索の際にメニューコンテナを表示するメソッド
	 */
    displayMenuResultsContainer() {
        document.getElementById('menu-board-container').style.display = 'block'; // メニューコンテナを表示
        document.getElementById('price-limit').options[0].selected = true; // 予算を初期状態にする
        this.menuResultContainer.style.display = 'none'; // メニューとシャッフルボタンのセットを格納するコンテナを非表示にする
    }

	/**
	 * 予算が選択されたとき、メニューを取得して表示するメソッド
	 */
	initMenus() {
		this.menuResultContainer.style.display = 'flex'; // メニューとシャッフルボタンのセットを格納するコンテナを表示する
	    this.menuResultContainer.querySelectorAll('.menu-result-wrapper').forEach(menuResultWrapper => {
	        this.getMenus(menuResultWrapper); // メニューを取得
	    });
	}
    
	/**
	 * メニューを取得するメソッド
	 */
    getMenus(menuResultWrapper) {
	    const brandName = document.getElementById('brand-name').value;
	    const priceLimit = document.getElementById('price-limit').value;
        fetch(`/chainstorenavi/get-menus?brandName=${brandName}&priceLimit=${priceLimit}`)
            .then(response => { // fetchの戻り値であるPromiseオブジェクトは、成功時then・失敗時catchを呼ぶ
                if (!response.ok) {
                    throw new Error(); // Promiseオブジェクトがrejectになるのはネットワークエラーなので、リクエスト失敗時にcatchで捕捉できるよう例外を投げる
                }
                return response.json(); // アロー関数の略記ではreturnしないと次のthenに値を渡せない
            })
            .then(menus => { // json()はPromiseオブジェクトを返すので、thenで繋げる必要がある
                this.getMenusSuccess(menus, menuResultWrapper);
            })
            .catch(error => {
                NoticeManager.createFailGetInformationNotice();
            });
    }

	/**
	 * メニュー取得に成功した場合の、メニュー表示を行うメソッド
	 */
    getMenusSuccess(menus, menuResultWrapper) {
        const menuBox = menuResultWrapper.querySelector('.menu-box');
        menuBox.innerHTML = ''; // メニューをクリア

        let priceCounter = 0; // 合計金額を累計する変数
        menus.forEach(menu => {
            menuBox.appendChild(this.createMenuDiv(menu)); // メニューを格納する要素を作成
            priceCounter += parseInt(menu.price); // 合計金額を累加
        });

        menuResultWrapper.querySelector('.total-price-value').textContent = priceCounter + '円'; // 合計金額を表示
    }

	/**
	 * メニューを格納する要素を作成するメソッド
	 */
    createMenuDiv(menu) {
        const menuDiv = document.createElement('div');
        menuDiv.className = 'menu';
        menuDiv.innerHTML = `
            <span class="menu-name">${menu.name}</span>
            <span class="menu-price">${menu.price}円</span>
        `;
        return menuDiv;
    }
}